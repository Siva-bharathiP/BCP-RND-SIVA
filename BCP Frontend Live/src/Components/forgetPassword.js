import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/forgetPassword.css'; 
import { TextField } from '@mui/material';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Submit email:', email);
    navigate('/reset-password');
  };

  return (
  <div className=" form d-flex justify-content-center align-items-center vh-100 ">

    <Container className="mt-5 shadow p-3 mb-5 bg-body rounded container vh-70 " id='con'>
      
      <h6 className="text-center mb-4 mt-4 fw-bold">FORGET PASSWORD</h6>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <TextField 
            className='label'
            type="email"
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            size="small"
          />
        </Form.Group>
        <Row className="mb-8 mt-3  ">
          <Col>
            <Form.Text className="text-left">
              <Link to="/reset-password">Reset Password?</Link>
            </Form.Text>
          </Col>
        </Row>
        <div className="btn-container mt-4 mb-3">
          <Button type="submit" className="btn btn-success  rounded-pill">
            Request Resent Link
          </Button>
        </div>
        <div className="text-center mt ">
      <Link to="/login" className='link'>Back to Login</Link>
      </div>
      </Form>
      
    </Container>
    
    </div>

  );
}

export default ForgotPassword;