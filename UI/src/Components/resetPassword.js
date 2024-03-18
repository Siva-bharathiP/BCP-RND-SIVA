import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/resetPassword.css'; 
import { Link } from 'react-router-dom';
import { TextField } from '@mui/material';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // You can handle the submission logic here, such as sending a reset password email
    console.log('Submit email:', email);
    console.log('New password:', password);
    console.log('Confirm password:', confirmPassword);
  };

  return (
    <div className="form d-flex justify-content-center align-items-center vh-70 ">
      <Container className="con mt-6 p-4 shadow bg-body rounded">
        <h6 className="text-center mb-5 mt-3 fw-bold">Reset Password</h6>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail" className="mb-4">
            <TextField 
              className='label'
              type="email"
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword" className="mb-4">
            <TextField
              className='label'
              type="password"
              label="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
            />
          </Form.Group>
          <Form.Group controlId="formBasicConfirmPassword" className="mb-4">
            <TextField
              className='label'
              type="password"
              label="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
            />
          </Form.Group>
          <div className="btn-container mt-5 ">
          <Button type="submit" className="btn-success">
            Reset Password
          </Button>
        </div>
        </Form>
      </Container>
      <div className="text-center mt-3 ">
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  );
}

export default ResetPassword;
