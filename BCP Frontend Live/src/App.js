import './App.css';
import ForgotPassword from './Components/forgetPassword';
import ResetPassword from './Components/resetPassword';
import Register from './Components/register';
import Dashboard from './Components/dashboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    document.title = 'BCP'; // Set the title to 'Dashboard'
  }, []);
  return (
    
    <Router>
    <Routes>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/dashboard" element={<Dashboard/>} />
    </Routes>
  </Router>
  );
}

export default App;
