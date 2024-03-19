import React, { useState } from 'react';
import { Container, Form, Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/register.css';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { PortURL } from './Config';


function Register() {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [companyError, setCompanyError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const navigate = useNavigate();

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validation logic for each field
    if (!username) {
      setUsernameError('Username is required');
      return;
    }
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    if (!company) {
      setCompanyError('Organization is required');
      return;
    }
    if (!phoneNumber) {
      setPhoneNumberError('Mobile number is required');
      return;
    }
    if (!newPassword) {
      setPasswordError('New password is required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
  
    // If all validations pass, proceed with form submission
    const requestBody = {
      userName: username,
      password: newPassword,
      email: email,
      organization: company,
      phoneNo: phoneNumber,
    };
  
    try {
      const response = await fetch(`${PortURL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        console.log('User registered successfully!');
        navigate('/login');
      } else {
        const data = await response.json();
        console.error('Error registering user:', data.message);
        
          if (response.status === 400) {
          if (data.errors) {
            if (data.errors.userName) {
              setUsernameError(data.errors.userName);
            }
            if (data.errors.email) {
              setEmailError(data.errors.email);
            }
            if (data.errors.organization) {
              setCompanyError(data.errors.organization);
            }
            if (data.errors.phoneNo) {  
              setPhoneNumberError(data.errors.phoneNo);
            }
            if (data.errors.password) {
              setPasswordError(data.errors.password);
            }
          } else {
            console.error('Unexpected server error:', data.message);
          }
        }
      }
    } catch (error) {
      console.error('Error registering user:', error.message);
    }
  };

  return (
    <Container className="mt-5 shadow p-3 mb-5 bg-body rounded container vh-70">
      <h6 className="text-center signup mb-5  ">SIGN UP</h6>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFirstName" className="mb-3">
          <TextField
            className="label"
            type="text"
            label="Username"
            value={username}
            onChange={(e) => {
              setUserName(e.target.value);
              setUsernameError('');
            }}
            fullWidth
            size="small"
            error={!!usernameError}
            helperText={usernameError}
            
          />
        </Form.Group>
        
        <Form.Group controlId="formEmailAddress" className="mb-3">
          <TextField
            className="label"
            type="email"
            label="Email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError('');
            }}
            fullWidth
            size="small"
            error={!!emailError}
            helperText={emailError}
          />
        </Form.Group>
        
        <Form.Group controlId="formCompany" className="mb-3">
          <TextField
            className="label"
            type="text"
            label="Organization"
            value={company}
            onChange={(e) => {
              setCompany(e.target.value);
              setCompanyError('');
            }}
            fullWidth
            size="small"
            error={!!companyError}
            helperText={companyError}
          />
        </Form.Group>
        
        <Form.Group controlId="formPhoneNumber" className="mb-3">
  <TextField
    className="label"
    type="tel"
    label="Mobile number"
    value={phoneNumber}
    onChange={(e) => {
      const enteredValue = e.target.value.replace(/\D/g, '');
      setPhoneNumber(enteredValue);
      setPhoneNumberError('');
    }}
    fullWidth
    size="small"
    error={!!phoneNumberError}
    helperText={phoneNumberError}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">+91</InputAdornment>
      ),
      inputMode: 'numeric', 
    }}
  />
</Form.Group>


        
        <Form.Group controlId="formNewPassword" className="mb-3">
          <TextField
            className="label"
            type={showNewPassword ? 'text' : 'password'}
            label="New password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setPasswordError('');
            }}
            fullWidth
            size="small"
            error={!!passwordError}
            helperText={passwordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" onClick={toggleNewPasswordVisibility}>
                  <IconButton edge="end">
                    {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Form.Group>
        
        <Form.Group controlId="formConfirmPassword" className="mb-3">
          <TextField
            className="label"
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirm password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setPasswordError('');
            }}
            fullWidth
            size="small"
            error={!!passwordError}
            helperText={passwordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" onClick={toggleConfirmPasswordVisibility}>
                  <IconButton edge="end">
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Form.Group>
        
        <div className="btn-container mt-5 mb-4">
          <Button type="submit" className="btn btn-success  rounded-pill">
            Submit
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default Register;


