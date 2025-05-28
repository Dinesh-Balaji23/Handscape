import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CSS/Form.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    shopName: '',
    address: '',
    category: '',
    upiId: '',
    contact: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    let temp = {};
    const requiredFields = ['name', 'email', 'password', 'confirmPassword', 'shopName', 'address', 'category', 'upiId', 'contact'];

    requiredFields.forEach(field => {
      if (!formData[field]?.trim()) {
        temp[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    if (!temp.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      temp.email = "Invalid email format";
    }

    if (!temp.password && formData.password.length < 6) {
      temp.password = "Password must be at least 6 characters";
    }

    if (!temp.confirmPassword && formData.password !== formData.confirmPassword) {
      temp.confirmPassword = "Passwords do not match";
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:9000/signupseller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Signup failed');

      navigate('/loginseller', {
        state: { signupSuccess: true, email: formData.email }
      });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const page = document.querySelector('.login-page');
    if (!page) return;

    const numParticles = 25;
    const particles = [];

    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = '0px';
      particle.style.animationDuration = `${6 + Math.random() * 5}s`;
      particle.style.opacity = Math.random().toFixed(2);
      const size = 4 + Math.random() * 4;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      page.appendChild(particle);
      particles.push(particle);
    }

    return () => {
      particles.forEach(particle => {
        if (page.contains(particle)) page.removeChild(particle);
      });
    };
  }, []);

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Create Seller Account</h2>
        <div className="logo">H</div>
        {serverError && <div className="server-error">{serverError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label><br />
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error-input' : ''}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label><br />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error-input' : ''}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group password-group">
            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Create a password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error-input' : ''}
              />
              <span onClick={togglePassword} className="eye-icon">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label><br />
            <div className="password-field">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error-input' : ''}
              />
              <span onClick={toggleConfirmPassword} className="eye-icon">
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="shopName">Shop Name</label><br />
            <input
              type="text"
              id="shopName"
              name="shopName"
              placeholder="Your shop name"
              value={formData.shopName}
              onChange={handleChange}
              className={errors.shopName ? 'error-input' : ''}
            />
            {errors.shopName && <span className="error">{errors.shopName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label><br />
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Shop address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'error-input' : ''}
            />
            {errors.address && <span className="error">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="contact">Contact Number</label><br />
            <input
              type="text"
              id="contact"
              name="contact"
              placeholder="Your contact number"
              value={formData.contact}
              onChange={handleChange}
              className={errors.contact ? 'error-input' : ''}
            />
            {errors.contact && <span className="error">{errors.contact}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label><br />
            <input
              type="text"
              id="category"
              name="category"
              placeholder="Shop category (e.g., Handicrafts, Jewelry)"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? 'error-input' : ''}
            />
            {errors.category && <span className="error">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="upiId">UPI ID</label><br />
            <input
              type="text"
              id="upiId"
              name="upiId"
              placeholder="Your UPI ID for payments"
              value={formData.upiId}
              onChange={handleChange}
              className={errors.upiId ? 'error-input' : ''}
            />
            {errors.upiId && <span className="error">{errors.upiId}</span>}
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Signing Up...' : 'SIGN UP'}
          </button>
        </form>
        <p className="signup-link">
          Already have an account? <Link to="/loginseller">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
