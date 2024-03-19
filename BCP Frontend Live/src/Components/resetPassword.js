import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/resetPassword.css';
import { Link } from 'react-router-dom';
import { TextField } from '@mui/material';
import { PortURL } from './Config';

function ResetPassword() {
  const [userName, setUserName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${PortURL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, oldPassword, newPassword }),
      });

      if (response.ok) {
        setSuccess(true);
          // Reset input fields and errors
      setUserName('');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setError(null);
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      console.error('Error resetting password:', error.message);
      setError('Error resetting password');
    }
  };

  return (
    <div className="form d-flex justify-content-center align-items-center">
      
      <Container className=" mt-6 p-4 shadow bg-body rounded">
        <h6 className="text-center mb-5 mt-3 fw-bold">RESET PASSWORD</h6>
        <Form onSubmit={handleSubmit}>
          {error && <div className="text-danger mb-3">{error}</div>}
          {success && <div className="text-success mb-3">Password reset successfully!</div>}
          <Form.Group controlId="formBasicUserName" className="mb-4">
            <TextField
              className="label"
              type="text"
              label="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
            />
          </Form.Group>
          <Form.Group controlId="formBasicOldPassword" className="mb-4">
            <TextField
              className="label"
              type="password"
              label="Old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
            />
          </Form.Group>
          <Form.Group controlId="formBasicNewPassword" className="mb-4">
            <TextField
              className="label"
              type="password"
              label="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
            />
          </Form.Group>
          <Form.Group controlId="formBasicConfirmNewPassword" className="mb-4">
            <TextField
              className="label"
              type="password"
              label="Confirm new password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
            />
          </Form.Group>
          <div className="btn-container">
            <Button type="submit" className="btn btn-success  rounded-pill" >
              Reset Password
            </Button>
          </div>
          
        </Form>
      </Container>
     
    </div>
    
  );
}

export default ResetPassword;
