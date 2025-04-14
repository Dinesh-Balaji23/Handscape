import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CSS/Login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const page = document.querySelector('.login-page');
    const numParticles = 25;

    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = '0px';
      particle.style.animationDuration = `${6 + Math.random() * 5}s`;
      particle.style.opacity = Math.random().toFixed(2);
      particle.style.width = `${4 + Math.random() * 4}px`;
      particle.style.height = particle.style.width;
      page.appendChild(particle);
    }
  }, []);

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome</h2>
        <div className="logo">H</div>
        <form>
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />

          <label>Password</label>
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
            />
            <span onClick={togglePassword} className="eye-icon">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit">LOGIN</button>
        </form>
        <p className="signup-link">
            Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;