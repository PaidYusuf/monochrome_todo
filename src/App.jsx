import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '../frontend/src/pages/LandingPage';
import LoginPage from '../frontend/src/pages/LoginPage';
import SignupPage from '../frontend/src/pages/SignupPage';
import DashboardPage from '../frontend/src/pages/DashboardPage';
import { ThemeProvider } from '../frontend/src/context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
