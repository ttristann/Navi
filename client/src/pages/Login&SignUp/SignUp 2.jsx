import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/Login.css'; 

function SignUp() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h3>Welcome to Navi</h3>
        <h2>Sign Up</h2>

        <form>
          <div className="input-wrapper">
            <input type="email" placeholder="Email Address" />
            <input type="password" placeholder="Password" />
          </div>

          <div className="login-options">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
            <span /> {/* Keeps layout consistent with login */}
          </div>

          <button type="submit">Sign Up</button>
        </form>

        <p className="signup-link">
          Already have an account? <NavLink to="/login">Log in</NavLink>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
