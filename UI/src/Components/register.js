import React, { useState } from 'react';
import { Container, Form, Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/register.css';
import { TextField } from '@mui/material';

function Register() {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // You can handle the submission logic here
    console.log('Submit registration:', {
      username,
      email,
      company,
      phoneNumber,
      newPassword,
      confirmPassword,
    });
    navigate('/login');
  };

  return (
    <Container className="mt-5 shadow p-3 mb-5 bg-body rounded container vh-70 ">
      
      <h6 className="text-center mb-4 mt-4 fw-bold">SIGN UP</h6>
      <Form onSubmit={handleSubmit}>
       
            <Form.Group controlId="formFirstName"  className="mb-3">
              <TextField
                className="label"
                type="text"
                label="Username"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                fullWidth
                size="small"
              />
            </Form.Group>
          
               <Form.Group controlId="formEmailAddress" className="mb-3">
          <TextField
            className="label"
            type="email"
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            size="small"
          />
        </Form.Group>
        <Form.Group controlId="formCompany" className="mb-3">   
          <TextField
            className="label"
            type="text"
            label="Organization"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            fullWidth
            size="small"
          />
        </Form.Group>
        <Form.Group controlId="formPhoneNumber" className="mb-3">
          <div className="input-group">
            <TextField
              className="label"
              type="tel"
              label="Mobile number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              fullWidth
              size="small"
            />
          </div>
        </Form.Group>
        <Form.Group controlId="formNewPassword" className="mb-3">
          <div className="input-group">
            <TextField
              className="label"
              type="password"
              label="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              size="small"
            />
          </div>
        </Form.Group>
        <Form.Group controlId="formConfirmPassword" className="mb-3">
          <div className="input-group">
            <TextField
              className="label"
              type="password"
              label="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              size="small"
            />
          </div>
        </Form.Group>
        <div className="btn-container mt-5 mb-4">
          <Button type="submit" className="btn-success">
            Submit
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default Register;
