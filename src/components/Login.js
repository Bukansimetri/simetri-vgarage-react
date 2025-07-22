import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import navigate hook
import './Login.css';
import './Backgrounds.css'; // Import the CSS file for backgrounds

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed.');
        return;
      }

      setError('');
      localStorage.setItem('token', data.token); // Store JWT token
      localStorage.setItem('isLoggedIn', 'true'); // (Optional)
      alert('Logged in!');
      navigate('/'); // Redirect to Dashboard
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  // Add this function for register navigation
  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  // Add this function for forgot password navigation
  const handleForgotPasswordRedirect = () => {
    navigate('/forgot-password');
  };

  const token = localStorage.getItem('token');

  return (
    <div className="login-container"> {/* Add bg-login class here */}
      <form onSubmit={handleLogin} className="login-form">
        <h2>Welcome to Virtual Garage</h2>
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
        <button type="submit">Login</button>
        {/* Register button */}
        <button
          type="button"
          className="register-btn"
          onClick={handleRegisterRedirect}
          style={{ marginTop: '12px' }}
        >
          Register
        </button>
        {/* Forgot Password button */}
        <button
          type="button"
          className="forgot-password-btn"
          onClick={handleForgotPasswordRedirect}
          style={{ marginTop: '12px' }}
        >
          Forgot Password?
        </button>
      </form>
    </div>
  );
};

export default Login;
