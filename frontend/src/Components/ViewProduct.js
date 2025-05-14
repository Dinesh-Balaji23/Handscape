import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './CSS/ViewProduct.css';

const ViewProduct = () => {
  const { username, id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product details using the product ID
        const productRes = await axios.get(`http://localhost:9000/products/${id}`);
        setProduct(productRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product?._id) return;
  
    try {
      setAddingToCart(true);
      const response = await axios.post('http://localhost:9000/cart/add', {
        productId: product._id,
        quantity: 1,
        username: username
      });
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div className="view-product-container">
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

      <div className="product-details-container">
      <div className="product-image-container">
        <img
          src={`http://localhost:9000/${product.imagePath}`}
          alt={product.productName}
          className="product-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/500x500?text=Product+Image';
          }}
        />
      </div>
      
      <div className="product-info-card">
        <h1 className="product-title">{product.productName}</h1>
        
        <div className="price-section">
          <span className="current-price">₹{product.price.toFixed(2)}</span>
        </div>
        
        <div className="rating-section">
          <div className="stars">
            {Array(5).fill().map((_, i) => (
              <span key={i} className={i < Math.round(product.avgRating) ? 'star-filled' : 'star-empty'}>
                {i < Math.round(product.avgRating) ? '★' : '☆'}
              </span>
            ))}
          </div>
          <span className="review-count">({product.reviewCount} reviews)</span>
        </div>
        
        <div className="product-meta">
          <div className="meta-item">
            <span className="meta-label">Category:</span>
            <span className="meta-value">{product.category || 'Not specified'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Sold by:</span>
            <span className="meta-value">{product.sellerName}</span>
          </div>
        </div>
        
        <p className="product-description">{product.description}</p>
        
        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={addingToCart}
        >
          {addingToCart ? (
            <>
              <span className="spinner"></span> Adding...
            </>
          ) : (
            'Add to Cart'
          )}
        </button>
      </div>
    </div>
  </div>
);
};

export default ViewProduct;
