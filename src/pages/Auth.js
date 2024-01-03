import { Container, Form, Button, Alert } from 'react-bootstrap';
import Header from '../components/Header';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';

function Auth () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isRegistration, setIsRegistration] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate()
    const errorCodes = {
        500: "Something went wrong, contact support",
        400: "User already exists",
        401: "Invalid email or password",
    };
    const handleInputChange = (e, setter) => {
        setError(null);
        setter(e.target.value);
      };
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
    const sendRequest = async (url, data) => {
        return await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    }

    const handleResponse = async (response, successMessage) => {
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorCodes[response.status] || 'Unknown error');
          return;
        }
        const userData = await response.json();
        console.log(successMessage, userData);
        navigate('/profile');
    };
    

    const handleLogin = async () => {
        try {
            const response = await sendRequest('/auth/login', {email, password});
            handleResponse(response, 'Login successful')
        } catch (error) {
            setError('Failed to complete login, contact support')
        }
    }
    const handleRegister = async () => {
        try {
          const response = await sendRequest('/auth/register', { username, email, password})
          handleResponse(response, 'Registration successful')
        } catch (error) {
          setError('Failed to complete registration, contact support')
        }
    };

    const handleToggleMode = () => {
        setIsRegistration(!isRegistration);
        setEmail('');
        setUsername('');
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
                                onChange={(e) => handleInputChange(e, setUsername)}
                                required
                            />
                        </Form.Group>}
                        <Form.Group controlId="email">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="Enter email" 
                                name="email" 
                                value={email} 
                                onChange={(e) => handleInputChange(e, setEmail)} 
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Password" 
                                name="password" 
                                value={password} 
                                onChange={(e) => handleInputChange(e, setPassword)}
                                required 
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