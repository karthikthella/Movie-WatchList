import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Typography } from '@mui/material';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      alert('Signin successful!');
      navigate('/main');
    } else {
      alert(data.error);
    }
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <div className="signup-container">
      <div className="fade1"></div>
      <Typography variant='h5' className='create-acc'>Sign in to your account</Typography>
      <Typography className='create-acc1'>Don't have an account? <a onClick={handleSignUpClick} style={{ cursor: 'pointer', color: '#17a2b8'}}>Sign up</a></Typography>
    <Box className="signin-form" onSubmit={handleSignin} autoComplete="off" noValidate component='form' >
      <input className="signup-input" type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} required />
      <input className="signup-input" type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} required />
      <button className="signup-button" type='submit'>Sign In</button>
    </Box>
    </div>


  );
};

export default Signin;
