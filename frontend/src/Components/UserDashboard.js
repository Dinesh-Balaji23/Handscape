import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './CSS/UserDashboard.css';

const UserDashboard = () => {
  const { username } = useParams();

  const features = [
    {
      title: 'Handmade by Local Artisans',
      description: 'Each item is crafted with care and creativity.'
    },
    {
      title: 'Simple & Secure Shopping',
      description: 'Easy ordering and a smooth browsing experience.'
    },
    {
      title: 'Support Small Businesses',
      description: 'Every purchase helps a real person doing real work.'
    },
    {
      title: 'Explore Our Collection',
      description: 'Check out the Products page to see what we’ve got.'
    }
  ];

  return (
    <div className="dashboard-container">
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: 'black' }}>
        <div className="container">
          <a
            className="navbar-brand"
            href={`/user-dashboard/${username}`}
            style={{ color: 'orange', fontWeight: 'bold' }}
          >
            Handscape
          </a>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to={`/user-dashboard/${username}`} className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to={`/products/${username}`} className="nav-link">Products</Link>
            </li>
            <li className="nav-item">
              <Link to={`/cart/${username}`} className="nav-link">Cart</Link>
            </li>
            <li className="nav-item">
              <Link to={`/orders/${username}`} className="nav-link">Orders</Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link">Logout ({username})</Link>
            </li>
          </ul>
        </div>
      </nav>

      <header className="banner">
        <h1>Welcome to Handscape</h1>
        <p>Browse handmade treasures from creative hands</p>
      </header>

      <section className="features-section">
        <h2>What’s Handscape About?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="browse-note">
          <p>👉 Head over to the <Link to={`/products/${username}`}>Products</Link> page to see our full collection!</p>
        </div>
      </section>

      <footer className="footer">
        <p>© 2025 Handscape.</p>
      </footer>
    </div>
  );
};

export default UserDashboard;
