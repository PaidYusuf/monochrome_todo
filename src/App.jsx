import LandingPage from '../frontend/src/pages/LandingPage';
import { ThemeProvider } from '../frontend/src/context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <LandingPage />
    </ThemeProvider>
  );
}

export default App;
