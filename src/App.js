import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Header from './components/Header';
import { useTheme } from './contexts/ThemeContext';
import { useState, React, useEffect } from 'react';
import './App.css';

function App() {
  const { theme } = useTheme();
  const [themeClass, setThemeClass] = useState('light');

  useEffect(() => {
    setThemeClass(theme);
  }, [theme]);

  return (
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
  );
}

export default App;
