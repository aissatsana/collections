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
import CreateCollection from './pages/CreateCollection';
import Collection from './pages/Collection'
import CreateItem from './pages/CreateItem';
import Item from './pages/Item';
import AdminPanel from './pages/AdminPanel';
import Footer from './components/Footer';
import { useAuth } from './contexts/AuthContext';
import Collections from './pages/Collections';

function App() {
  const { theme } = useTheme();
  const [themeClass, setThemeClass] = useState('light');
  const  { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    setThemeClass(theme);
  }, [theme]);

  return (
    <I18nextProvider i18n={i18n}>
        <Router>
        <div className={`App ${themeClass} d-flex flex-column`}>
          <Header />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/collection/create" element={<CreateCollection />} />
            <Route path="/collection/edit/:collectionId" element={<CreateCollection />} />
            <Route path="/collection/:collectionId" element={<Collection />} />
            <Route path="/collection/:collectionId/item" element={<CreateItem />} />
            <Route path="/collection/:collectionId/edit/:itemId" element={<CreateItem />} />
            <Route path="/item/:itemId" element={<Item />} />
            <Route path="/admin" element={isAdmin ? <AdminPanel /> : <Main />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Main />} />
            <Route path="/auth" element={isAuthenticated ? <Main /> : <Auth />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </I18nextProvider>
  );
}

export default App;
