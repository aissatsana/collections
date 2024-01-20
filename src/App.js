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
import CreateCollection from './pages/Create-collection';
import Collection from './pages/Collection'
import CreateItem from './pages/CreateItem';
import Item from './pages/Item';
import AdminPanel from './pages/AdminPanel';

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
            <Route path="/collection/create" element={<CreateCollection />} />
            <Route path="/collection/edit/:collectionId" element={<CreateCollection />} />
            <Route path="/collection/:collectionId" element={<Collection />} />
            <Route path="/collection/:collectionId/item" element={<CreateItem />} />
            <Route path="/collection/:collectionId/edit/:itemId" element={<CreateItem />} />
            <Route path="/item/:itemId" element={<Item />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </div>
      </Router>
    </I18nextProvider>
  );
}

export default App;
