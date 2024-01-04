import React from 'react';
import { Container, Navbar, Form, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher';
import LangSwitcher from './LangSwitcher';
import { useTranslation } from 'react-i18next';

const Header = () => {
    const { t } = useTranslation();
    return (
      <Navbar>
        <Container className="d-flex align-items-center">
            <Navbar.Brand className="mr-4" href="/">My Collection</Navbar.Brand>
            <Form inline="true">
                <FormControl type="text" placeholder={`${t('Search')}...`} className="mr-sm-2" />
            </Form>
            <LangSwitcher />
            <ThemeSwitcher />
            <Link to="/auth" className="btn">
              {t('Log in')}
            </Link>
        </Container>
      </Navbar>
    );
};
  
export default Header;
