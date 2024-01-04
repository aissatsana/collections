import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Header from './components/Header';
import { useTheme } from './contexts/ThemeContext';
import { useState, React, useEffect } from 'react';
import './App.css';
import { I18nextProvider } from 'react-i18next';
import i18n from './contexts/i18n';

function App() {
  const { theme } = useTheme();
  const [themeClass, setThemeClass] = useState('light');

  useEffect(() => {
    setThemeClass(theme);
  }, [theme]);

  return (
    <I18nextProvider i18n={i18n}>
        <Router>
        <div className={`App ${themeClass}`}>
          <Header />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </I18nextProvider>
  );
}

export default App;
