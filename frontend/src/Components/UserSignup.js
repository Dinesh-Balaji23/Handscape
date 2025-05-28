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
    if (!formData.contact) temp.contact = "Contact number is required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:9000/signupuser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          contact: formData.contact
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Signup failed');
      setFormData({ name: '', email: '', password: '', confirmPassword: '', contact: '' });
      setErrors({});
      navigate('/login');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setIsSubmitting(false);
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
        {serverError && <div className="server-error">{serverError}</div>}
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

          <label>Contact Number</label>
          <input
            type="text"
            name="contact"
            placeholder="Your contact number"
            value={formData.contact}
            onChange={handleChange}
          />
          {errors.contact && <span className="error">{errors.contact}</span>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing Up...' : 'SIGN UP'}
          </button>
        </form>
        <p className="signup-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
