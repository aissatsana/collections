import React from 'react';
import { Container, Navbar, Form, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
      <Navbar bg="light" variant="light">
        <Container className="d-flex align-items-center">
            <Navbar.Brand className="mr-4" href="/">My Collection</Navbar.Brand>
            <Form inline="true">
                <FormControl type="text" placeholder="Search..." className="mr-sm-2" />
            </Form>
            {/* <Button className="ms-auto" variant="dark" onClick={onOpenAuthModal}>
                Log In
            </Button> */}
          <Link to="/auth" className="ms-auto btn btn-dark">
            Log in
          </Link>
        </Container>
      </Navbar>
    );
};
  
export default Header;
