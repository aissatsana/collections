import React, { useState } from 'react';
import { Container, Navbar, Form, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher';
import LangSwitcher from './LangSwitcher';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Header = () => {
    const { t } = useTranslation();
    const { isAuthenticated, isAdmin, setAuthStatus } = useAuth();
    const [expanded, setExpanded] = useState(false);
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
    const handleNavbarToggle = () => {
        setExpanded(!expanded);
    }
    return (
      <Navbar expand="lg">
        <Container className="d-flex align-items-center">
            <Navbar.Brand className="mr-4 fw-bold" href="/">My Collection</Navbar.Brand>
            <LangSwitcher />
            <ThemeSwitcher />
            <Navbar.Toggle aria-controls="navbar" onClick={handleNavbarToggle} />
            <Navbar.Collapse id="navbar" className={`justify-content-end ${expanded ? 'show' : ''}`}>
            {isAdmin && (
                <Link to="/admin" className='btn me-2'>
                    {t('Admin')}
                </Link>
            )}     
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
            </Navbar.Collapse>
            {/* <Form inline="true">
                <FormControl type="text" placeholder={`${t('Search')}...`} className="mr-sm-2" />
            </Form> */}
        </Container>
      </Navbar>
    );
};
  
export default Header;
