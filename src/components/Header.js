import React from 'react';
import { Container, Navbar, Form, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher';
import LangSwitcher from './LangSwitcher';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Header = () => {
    const { t } = useTranslation();
    const { isAuthenticated, setAuthStatus } = useAuth();
    const logout = async (e) => {
        try {
            const token = JSON.parse(localStorage.getItem('token'));
            const response = await axios.post('/auth/logout', {}, {
              headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json',
              },
            });
            if (response.status === 200) {
                localStorage.removeItem('authData');
                setAuthStatus(false);
            }
        } catch (error) {
            console.error(error);
        }
    }
    return (
      <Navbar>
        <Container className="d-flex align-items-center">
            <Navbar.Brand className="mr-4" href="/">My Collection</Navbar.Brand>
            <Form inline="true">
                <FormControl type="text" placeholder={`${t('Search')}...`} className="mr-sm-2" />
            </Form>
            <LangSwitcher />
            <ThemeSwitcher />
            {isAuthenticated ? (
                <>
                   <Link to="/profile" className="btn me-2">
                        {t('Profile')}
                    </Link>
                    <Button onClick={logout} className="btn">
                        {t('Log out')}
                    </Button>
                </>
            ) : (
                <Link to="/auth" className="btn">
                    {t('Log in')}
                </Link>
            )}
        </Container>
      </Navbar>
    );
};
  
export default Header;
