import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './CSS/ProductList.css';

const ProductList = () => {
  const { username } = useParams(); // 🔥 Get username from URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:9000/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-list-container">
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: 'black' }}>
        <div className="container">
          <a className="navbar-brand" href={`/user-dashboard/${username}`} style={{ color: 'orange', fontWeight: 'bold' }}>
            Handscape
          </a>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to={`/user-dashboard/${username}`} className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to={`/products/${username}`} className="nav-link active">Products</Link>
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
        <h1>Explore Our Products</h1>
        <p>Find the perfect handmade item for you</p>
      </header>

      <section className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="product-card">
              <img
                src={`http://localhost:9000/${product.imagePath}`}
                alt={product.productName}
                className="product-image"
              />
              <h3 className="product-name">{product.productName}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-price">Rs. {product.price}</div>
              <div className="product-rating">
                <span className="review-count">({product.reviewCount} reviews)</span>
              </div>
              <Link to={`/viewprod/${username}/${product._id}`} className="btn btn-primary">
                View Details
              </Link>
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </section>

      <footer className="footer">
        <p>© 2025 Handscape.</p>
      </footer>
    </div>
  );
};

export default ProductList;
