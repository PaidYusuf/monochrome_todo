import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Helper: get token
  const getToken = () => localStorage.getItem('token');

  // Helper: fetch theme from backend
  const fetchThemeFromBackend = async () => {
    try {
      const token = getToken();
      if (!token) return null;
      const res = await fetch('https://monochrome-todo.onrender.com/api/user/theme', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.darkMode;
    } catch {
      return null;
    }
  };

  // Helper: save theme to backend
  const saveThemeToBackend = async (mode) => {
    try {
      const token = getToken();
      if (!token) return;
      await fetch('https://monochrome-todo.onrender.com/api/user/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ darkMode: mode })
      });
    } catch {}
  };

  // Initial theme: cookie, then backend, then default
  const [darkMode, setDarkModeState] = useState(() => {
    const cookiePref = Cookies.get('darkMode');
    if (cookiePref !== undefined) {
      return cookiePref === 'true';
    }
    // Default: dark mode if no cookie
    return true;
  });

  useEffect(() => {
    const initTheme = async () => {
      let mode = Cookies.get('darkMode');
      if (mode !== undefined) {
        setDarkModeState(mode === 'true');
        return;
      }
      // If logged in, try backend
      const backendMode = await fetchThemeFromBackend();
      if (backendMode !== null) {
        setDarkModeState(!!backendMode);
        Cookies.set('darkMode', backendMode ? 'true' : 'false', { expires: 365 });
        return;
      }
      setDarkModeState(false);
    };
    initTheme();
  }, []);

  // Save theme to cookie and backend on change
  useEffect(() => {
    Cookies.set('darkMode', darkMode ? 'true' : 'false', { expires: 365 });
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    saveThemeToBackend(darkMode);
  }, [darkMode]);

  // Expose setter
  const setDarkMode = (mode) => {
    setDarkModeState(mode);
  };

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
