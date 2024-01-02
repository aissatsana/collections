import { Container, Form, Button } from 'react-bootstrap';
import Header from '../components/Header';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth.css';

function Auth () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isRegistration, setIsRegistration] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    } 
    const handleNameChange = (e) => {
        setName(e.target.value);
    }
    const handleSubmit = () => {
        if (isRegistration) {
            handleRegister();
        } else {
            handleLogin();
        }
    }
    const handleLogin = () => {
        console.log('пока ниче')
    }
    const handleRegister = async () => {
        try {
          const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });
    
          if (!response.ok) {
            const errorData = await response.json();
            console.error('Registration failed:', errorData.error);
            return;
          }
          const userData = await response.json();
          console.log('Registration successful:', userData);
        } catch (error) {
          console.error('Error during registration:', error);
        }
      };

    const handleToggleMode = () => {
        setIsRegistration(!isRegistration);
    }
    return (
        <div className="bg-light">
        <Header />
            <Container className="auth-container">
                <div className="auth-block">
                    <h1>{isRegistration ? 'Sign up' : 'Log in'}</h1>
                    <Form>
                        {isRegistration ?                         
                        <Form.Group controlId="loginPassword">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control type="name" placeholder="Enter your name" name="name" value={name} onChange={handleNameChange} />
                        </Form.Group> : ''}
                        <Form.Group controlId="loginEmail">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" name="name" value={email} onChange={handleEmailChange} />
                        </Form.Group>
                        <Form.Group controlId="loginPassword">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control type="password" placeholder="Password" name="password" value={password} onChange={handlePasswordChange} />
                        </Form.Group>
                        <Button className="mt-3 auth-button" variant="primary" onClick={handleSubmit}>
                            {isRegistration ? 'Register' : 'Log In'}
                        </Button>
                    </Form>
                    <p className="mt-2">
                        {isRegistration
                        ? 'Already have an account?'
                        : "Don't have an account?"}
                        <Link to="#" onClick={handleToggleMode}>
                        {isRegistration ? ' Log in' : ' Sign up'}
                        </Link>
                    </p>
                </div>
            </Container>
        </div>
    )
}

export default Auth;