import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Github } from 'react-bootstrap-icons';

const Footer = () => {
  return (
    <footer className="mt-5 border-top py-3">
      <Container className="d-flex justify-content-between align-items-center">
        <Link to="/" className="text-decoration-none link">
          <span className="fw-bold">My Collection</span>
        </Link>
        <a
          href="https://github.com/aissatsana/collections"
          target="_blank"
          rel="noopener noreferrer"
          className='link'
        >
          <Github size={20} className="me-2" />
          GitHub
        </a>
      </Container>
    </footer>
  );
};

export default Footer;
