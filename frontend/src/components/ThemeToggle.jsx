import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../context/ThemeContext';

const ToggleButton = styled.button`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 100;
  background: #222;
  color: #fff;
  border: none;
  border-radius: 50px;
  padding: 0.5rem 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #fff;
    color: #222;
    border: 1px solid #222;
  }
`;

const ThemeToggle = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  return (
    <ToggleButton onClick={() => setDarkMode((prev) => !prev)}>
      {darkMode ? 'Light Theme' : 'Dark Theme'}
    </ToggleButton>
  );
};

export default ThemeToggle;
