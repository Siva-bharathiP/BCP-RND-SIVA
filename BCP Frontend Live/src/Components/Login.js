import React, { useState } from 'react';
import { Container, Form, Button,Row,Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import '../styles/Login.css';
import { PortURL } from './Config';

function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  // const PortURL = 'http://localhost:3001'; 

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate username
    if (!userName) {
      setUsernameError('Username is required');
      return;
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      return;
    }
    const requestBody = { userName, password };

    try {
      const response = await fetch(`${PortURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      if (response.ok) {
        // const data = await response.json();
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', userName); 

        console.log('User logged in successfully!');
  

        navigate('/dashboard');
      } else {
        const data = await response.json();
        console.log('Login failed:', data.message);
  
        if (response.status === 400 && data.message === 'User Not Found!') {
          setServerError('Username not found.');

        } else if (response.status === 401 && data.message === 'Invalid Password!') {
          setServerError('Invalid password!');
        } 
        else {
          setServerError('An error occurred while logging in.');
        }
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setServerError('An error occurred while logging in.');
    }
  };

  return (
    <div className="form d-flex justify-content-center align-items-center ">
      <Container className="con mt-5 p-4 shadow bg-body rounded">
        <h6 className="text-center mb-2 mt-1 display-6 ">Sign in</h6>
        <p>Navigate your Buisness with Ease!!!</p>
        {serverError && (
      <div className="text-center mt-2"> 
        <p className="text-danger">{serverError}</p>
      </div>
    )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail" className="mb-4 mt-4 ">
            <TextField
              className='label form-control border-primary'
              type="text"
              label="Username"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                setUsernameError('');
                setServerError('');
              }}
              fullWidth
              variant="outlined"
              size="small"
              error={!!usernameError}
              helperText={usernameError}
            
            
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword" className="mb-2 mt-4">
            <TextField
              className='label form-control'
              type="password"
              label="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError('');
                setServerError('');
              }}
              fullWidth
              variant="outlined"
              size="small"
              error={!!passwordError}
              helperText={passwordError}
            />
          </Form.Group>
          <Row className="mb-4 mt-2 p-1 ">
          <Col>
            <Form.Text className="text-left">
              <Link to="/forgot-password">Forgot Password?</Link>
            </Form.Text>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <Form.Check
              type="checkbox"
              label="Remember me"
              className="text-right"
            />
          </Col>
        </Row>
          <div className="btn-container mt-4 mb-5">
            <Button type="submit" className="btn btn-success  rounded-pill">
              Sign in
            </Button>
          </div>
        </Form>
        <div className="text-center mt-5 signup ">
        New to BCP? <Link to="/register"> Sign up</Link>
      </div>
      </Container>
      
    </div>
  );
}

export default Login;
