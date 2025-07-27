import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

// Use environment variable or fallback to local development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://simetri-vgarage-backend.onrender.com';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); // Reset error state
    
    // Validation
    const { name, email, password, confirmPassword } = formData;
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill out all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name, email, password }),
      });

      // Handle non-2xx responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          `Registration failed with status ${response.status}`
        );
      }

      const data = await response.json();
      
      // Success case
      alert('Registered successfully! Please login.');
      navigate('/login');
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.message || 
        'Server error. Please try again later. ' +
        'If this persists, contact support.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleRegister} className="login-form">
        <h2>Create Account</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password (min 6 characters)"
          value={formData.password}
          onChange={handleChange}
          minLength="6"
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;