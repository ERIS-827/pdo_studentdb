import React, { useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import './Login.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Hook for programmatic navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('Email and password are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });

      const { token, user } = response.data;
      setSuccessMessage('Login successful!');

      // Store token and user info in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userInfo', JSON.stringify(user)); // Store user info

      // If user is an admin, redirect to dashboard
      if (user.isAdmin) {
        navigate('/dashboard'); // Navigate to dashboard route
      } else {
        navigate('/error'); // Navigate to error page for non-admin users
      }
    } catch (error) {
      console.error('Login Error:', error);
      if (error.response) {
        // Server returned a response with an error
        setErrorMessage(error.response.data.message || 'Invalid login credentials.');
      } else {
        // Network error or no response from the server
        setErrorMessage('Network error. Please try again later.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">
            <FaEnvelope className="icon" />
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">
            <FaLock className="icon" />
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
