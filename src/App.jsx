import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '../frontend/src/pages/LandingPage';
import LoginPage from '../frontend/src/pages/LoginPage';
import { ThemeProvider } from '../frontend/src/context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
