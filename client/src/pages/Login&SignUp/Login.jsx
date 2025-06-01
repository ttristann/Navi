import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import '../../styles/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser();


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      setUser({
        id: data.user.id,
        username: data.user.username,
        email: data.user.email
      });
      console.log('Logged in user:', data.user);
      // Save user context or token here
      navigate('/');
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h3>Welcome Back to Navi</h3>
        <h2>Log into your account</h2>

        <form onSubmit={handleLogin}>
          <div className="input-wrapper">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="login-options">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
            <a href="#">Forgot Password?</a>
          </div>

          <button type="submit">Log in</button>
          {error && <p className="error-message">{error}</p>}
        </form>

        <p className="signup-link">
          Don’t have an account? <NavLink to="/signup">Create one</NavLink>
        </p>
      </div>
    </div>
  );
}

export default Login;
