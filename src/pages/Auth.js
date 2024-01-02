import { Container, Form, Button, Alert } from 'react-bootstrap';
import Header from '../components/Header';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth.css';

function Auth () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUserame] = useState('');
    const [isRegistration, setIsRegistration] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const errorCodes = {
        500: "Something went wrong, contact support",
        400: "User already exists",
        401: "Invalid email or password",
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    } 
    const handleNameChange = (e) => {
        setUserame(e.target.value);
    }
    const handleSubmit = async () => {
        if (isSubmitting) {
          return;
        }
        setIsSubmitting(true);
        try {
          isRegistration ? await handleRegister() : await handleLogin();
        } finally {
          setIsSubmitting(false);
        }
    };
    const handleLogin = async () => {
        try {
            const response = await fetch('/auth/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
            });
      
            if (!response.ok) {
              //const errorData = await response.json();
              setError(errorCodes[response.status] || 'Unknown error');
              return;
            }
            const userData = await response.json();
            console.log('Login successful:', userData);
          } catch (error) {
            setError('Failed to complete login, contact support')
          }
    }
    const handleRegister = async () => {
        try {
          const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
          });
    
          if (!response.ok) {
            //const errorData = await response.json();
            setError(errorCodes[response.status] || 'Unknown error');
            return;
          }
          const userData = await response.json();
          console.log('Registration successful:', userData);
        } catch (error) {
          setError('Failed to complete registration, contact support')
        }
    };

    const handleToggleMode = () => {
        setIsRegistration(!isRegistration);
        setEmail('');
        setUserame('');
        setPassword('');
        setError('');
    }
    return (
        <div className="bg-light">
        <Header />
            <Container className="auth-container">
                <div className="auth-block">
                    <h1>{isRegistration ? 'Sign up' : 'Log in'}</h1>
                    <Form>
                        {isRegistration &&                        
                        <Form.Group controlId="username">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control 
                                type="name" 
                                placeholder="Enter your name" 
                                name="username" 
                                value={username} 
                                onChange={handleNameChange}
                            />
                        </Form.Group>}
                        <Form.Group controlId="email">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="Enter email" 
                                name="email" 
                                value={email} 
                                onChange={handleEmailChange} 
                            />
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Password" 
                                name="password" 
                                value={password} 
                                onChange={handlePasswordChange} 
                            />
                        </Form.Group>
                        <Button className="mt-3 auth-button" variant="dark" onClick={handleSubmit} disabled={isSubmitting}>
                            {isRegistration ? 'Register' : 'Log In'}
                        </Button>
                    </Form>
                    {error && <Alert className="mt-2" variant="danger">{error}</Alert>}
                    <p className="mt-2">
                        {isRegistration
                        ? 'Already have an account?'
                        : "Don't have an account?"}
                        <Link to="#" onClick={handleToggleMode} disabled={isSubmitting}>
                        {isRegistration ? ' Log in' : ' Sign up'}
                        </Link>
                    </p>
                </div>
            </Container>
        </div>
    )
}

export default Auth;