import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CSS/Form.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let temp = {};

    if (!formData.name.trim()) temp.name = "Name is required";
    if (!formData.email.trim()) temp.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) temp.email = "Invalid email format";

    if (!formData.password) temp.password = "Password is required";
    if (!formData.confirmPassword) temp.confirmPassword = "Please confirm password";
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      temp.confirmPassword = "Passwords do not match";
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert('Signup successful!');
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      setErrors({});
    }
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
        <h2>Create User Account</h2>
        <div className="logo">H</div>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className="error">{errors.name}</span>}

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Your email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}

          <label>Password</label>
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
            <span onClick={togglePassword} className="eye-icon">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && <span className="error">{errors.password}</span>}

          <label>Confirm Password</label>
          <div className="password-field">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <span onClick={toggleConfirmPassword} className="eye-icon">
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}

          <button type="submit">SIGN UP</button>
        </form>
        <p className="signup-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
