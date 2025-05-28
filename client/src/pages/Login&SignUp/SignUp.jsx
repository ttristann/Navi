import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../../styles/Login.css'; 

function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.name.trim()) {
      setError('Name is required');
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Update the URL to include the full server address
      const response = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful
        console.log('User registered:', data.user);
        alert('Registration successful! Redirecting to login...');
        // Redirect to login page
        navigate('/login');
      } else {
        // Handle error response
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h3>Welcome to Navi</h3>
        <h2>Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
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
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="login-options">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
            <span /> {/* Keeps layout consistent with login */}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="signup-link">
          Already have an account? <NavLink to="/login">Log in</NavLink>
        </p>
      </div>
    </div>
  );
}

export default SignUp;