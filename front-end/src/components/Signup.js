import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import './Signup.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });  // Unified message state

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous messages
    setMessage({ text: '', type: '' });

    if (!username || !email || !password) {
      setMessage({ text: 'All fields are required.', type: 'error' });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/signup', {
        username,
        email,
        password,
      });

      setMessage({ text: 'Signup successful!', type: 'success' });
      console.log(response.data);
    } catch (error) {
      console.error('Signup Error:', error);

      if (error.response) {
        setMessage({
          text: error.response.data.message || 'Signup failed. Please try again.',
          type: 'error',
        });
      } else {
        setMessage({ text: 'Network error. Please try again later.', type: 'error' });
      }
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Signup</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">
            <FaUser className="icon" />
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

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

        {message.text && (
          <p className={message.type === 'error' ? 'error-message' : 'success-message'}>
            {message.text}
          </p>
        )}

        <button type="submit" className="signup-button">
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
