import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './CSS/Cart.css';

const Cart = () => {
  const { username } = useParams();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart data from backend
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/cart/${username}`);
        setCartItems(response.data.items);
      } catch (error) {
        console.error('Error fetching cart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [username]);

  const handleRemoveFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:9000/cart/remove/${productId}`, {
        data: { username }
      });
      setCartItems(cartItems.filter(item => item.productId._id !== productId));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  if (loading) return <div className="loading">Loading cart...</div>;

  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.productId.price * item.quantity;
  }, 0);

  return (
    <div className="cart-container">
      {/* Navbar with your exact styling */}
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
              <Link to={`/products/${username}`} className="nav-link">Products</Link>
            </li>
            <li className="nav-item">
              <Link to={`/cart/${username}`} className="nav-link active">Cart</Link>
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

      {/* Cart Content with improved styling */}
      <div className="cart-content">
        <h2>Your Shopping Cart</h2>
        
        {cartItems.length > 0 ? (
          <>
            <div className="cart-table">
              <div className="cart-header">
                <div className="header-item">Product</div>
                <div className="header-item">Price</div>
                <div className="header-item">Quantity</div>
                <div className="header-item">Total</div>
                <div className="header-item">Action</div>
              </div>
              
              {cartItems.map((item) => (
                <div className="cart-row" key={item.productId._id}>
                  <div className="cart-cell product-info">
                    <img
                      src={`http://localhost:9000/${item.productId.imagePath}`}
                      alt={item.productId.productName}
                      className="product-image"
                    />
                    <span className="product-name">{item.productId.productName}</span>
                  </div>
                  <div className="cart-cell">₹{item.productId.price.toFixed(2)}</div>
                  <div className="cart-cell">{item.quantity}</div>
                  <div className="cart-cell">₹{(item.productId.price * item.quantity).toFixed(2)}</div>
                  <div className="cart-cell">
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveFromCart(item.productId._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="total-section">
                <h3>Order Summary</h3>
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Shipping:</span>
                  <span>FREE</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total:</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <button className="checkout-btn">Proceed to Payment</button>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <Link to={`/products/${username}`} className="shop-btn">Continue Shopping</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;