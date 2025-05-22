import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/Login.css'; 

function Login() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h3>Welcome Back to Navi</h3>
        <h2>Log into your account</h2>

        <form>
          <div className="input-wrapper">
            <input type="email" placeholder="Email Address" />
            <input type="password" placeholder="Password" />
          </div>

          <div className="login-options">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
            <a href="#">Forgot Password?</a>
          </div>

          <button type="submit">Log in</button>
        </form>

        <p className="signup-link">
          Don’t have an account? <NavLink to="/signup">Create one</NavLink>
        </p>
      </div>
    </div>
  );
}

export default Login;