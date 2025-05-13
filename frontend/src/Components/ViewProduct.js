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
              <Link to="/login" className="nav-link">Logout</Link>
            </li>
          </ul>
        </div>
      </nav>

      <div style={{ height: '100px' }}></div>

      <div className="product-details">
        <img
          src={`http://localhost:9000/${product.imagePath}`}
          alt={product.productName}
          className="product-detail-image"
        />
        <div className="product-info">
          <h2>{product.productName}</h2>
          <p className="price">₹{product.price}</p>
          <button 
            className="add-to-cart-button" 
            onClick={handleAddToCart} 
            disabled={addingToCart}
          >
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
          <p className="desc">{product.description}</p>
          <p className="category"><strong>Category:</strong> {product.category || 'Not specified'}</p>
          <div className="rating-section">
            <span className="stars">
              {'★'.repeat(Math.round(product.avgRating))}{'☆'.repeat(5 - Math.round(product.avgRating))}
            </span>
            <span className="review-count">({product.reviewCount} reviews)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
