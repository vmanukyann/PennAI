import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [rawPassword, setRawPassword] = useState('');
  const [message, setMessage] = useState('');

  // Backend connectivity check
  useEffect(() => {
    axios.get('http://localhost:5000/ping')
      .then(res => console.log('✅ Backend is reachable:', res.data))
      .catch(err => console.error('❌ Backend not reachable:', err));
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Hash password before sending
    const encoder = new TextEncoder();
    const data = encoder.encode(rawPassword);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashedArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashedArray.map(b => b.toString(16).padStart(2, '0')).join('');

    try {
      const response = await axios.post('http://localhost:5000/register', {
        username,
        password: hashedPassword
      });

      setMessage(response.data.message);
    } catch (error) {
      if (error.response && error.response.data.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage('Registration failed');
      }
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={rawPassword}
        onChange={(e) => setRawPassword(e.target.value)}
        required
      />
      <button type="submit">Register</button>
      <p>{message}</p>
    </form>
  );
};

export default RegisterForm;
