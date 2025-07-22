import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // You can reuse Login.css or create a new one

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

const handleRegister = async (e) => {
  e.preventDefault();

  if (!email || !password || !confirmPassword || !name) {
    setError('Please fill out all fields.');
    return;
  }

  if (password !== confirmPassword) {
    setError('Passwords do not match.');
    return;
  }

  try {
    const response = await fetch('http://localhost:5001/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || 'Registration failed.');
      return;
    }

    setError('');
    alert('Registered successfully!');
    navigate('/login');
  } catch (err) {
    setError('Server error. Please try again later.');
  }
};

  return (
    <div className="login-container">
      <form onSubmit={handleRegister} className="login-form">
        <h2>Register</h2>
        
        <input
          type="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
