import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Typography } from '@mui/material';
import zIndex from '@mui/material/styles/zIndex';


const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const response = await fetch('https://server-sandy-eta-92.vercel.app/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstname, lastname, username, email, password }),
    });
  
    if (!response.ok) {
      const errorData = await response.text(); 
      alert(`Error: ${errorData}`); 
      return;
    }
  
    const data = await response.json(); 
    navigate('/signin');
  };

  const handleSignInClick = () => {
    navigate('/signin');
  };

  return (
    <div className="signup-container">
      <div className="fade1"></div>
      
      <Typography variant='h5' className='create-acc'>Create a new account</Typography>
      <Typography className='create-acc1'>Or <a onClick={handleSignInClick} style={{ cursor: 'pointer', color: '#17a2b8'}}>sign in with an existing account</a></Typography>
    <Box className="signup-form" onSubmit={handleSignup} autoComplete="off" noValidate component='form' >
      <div className="name-field">
      <input className="signup-names-first" required placeholder="First Name"  onChange={(e) => setFirstname(e.target.value)} autoComplete='off'/>
      <input className="signup-names-last" required placeholder="Last Name"  onChange={(e) => setLastname(e.target.value)} autoComplete='off'/>
      </div>
      <input  className="signup-input" required placeholder="Email"  onChange={(e) => setEmail(e.target.value)} autoComplete='off'/>
      <input className="signup-input" required placeholder="Username" onChange={(e) => setUsername(e.target.value)} autoComplete='off'/>
      <input className="signup-input" required placeholder="password" type='password' onChange={(e) => setPassword(e.target.value)} />
      <button type='submit' className="signup-button">Sign Up</button>
    </Box>
    </div>
  );
};

export default Signup;
