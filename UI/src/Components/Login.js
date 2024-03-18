import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material'
import '../styles/Login.css'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // You can handle the submission logic here, such as sending a reset password email
    console.log('Submit email:', email);
    console.log('New password:', password);
    navigate('/dashboard');
  };

  return (
    <div className=" form d-flex justify-content-center align-items-center vh-100 ">

    <Container className="con mt-6 p-4  shadow bg-body rounded">
      <h6 className="text-center mb-4 mt-3 fw-bold ">Sign in</h6>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail" className="mb-4 mt-4">
          <TextField
            className='label'
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword" className="mb-2 mt-4">
          <TextField
            className='label'
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
          />
        </Form.Group>
    
        <Row className="mb-3  ">
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
        <div className="btn-container mt-5 ">
          <Button type="submit" className="btn-success">
            Sign in
          </Button>
        </div>
      </Form>

    </Container>
    <div className="text-center mt-3 ">
        New to BCP? <Link to="/register">Sign up</Link>
      </div>
    </div>

  );
}

export default Login;