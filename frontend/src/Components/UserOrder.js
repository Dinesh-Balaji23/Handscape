import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './CSS/Cart.css'; // Reusing your Cart styles

const UserOrder = () => {
    const { username } = useParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
  
    useEffect(() => {
        const fetchOrders = async () => {
          try {
            console.log(`Fetching orders for ${username}`); // Debug log
            const response = await axios.get(
              `http://localhost:9000/user-orders/${username}`
            );
            console.log('Received orders:', response.data); // Debug log
            setOrders(response.data);
            setLoading(false);
          } catch (error) {
            console.error('Order fetch error:', error.response?.data || error.message);
            setError('Failed to load orders. Please try again.');
            setLoading(false);
          }
        };
        
        fetchOrders();
      }, [username]);

      const handleCancelOrder = async (orderId) => {
        try {
          const response = await axios.patch(
            'http://localhost:9000/orders/status',
            {
              orderId,
              status: 'Cancelled'
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          
          setOrders(orders.map(order => 
            order._id === orderId ? { ...order, status: 'Cancelled' } : order
          ));
          alert('Order cancelled successfully');
        } catch (error) {
          console.error('Error cancelling order:', error);
          alert(`Failed to cancel order: ${error.response?.data?.error || error.message}`);
        }
      };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="cart-container">
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: 'black' }}>
        <div className="container">
          <a className="navbar-brand" href={`/user-dashboard/${username}`} style={{ color: 'orange', fontWeight: 'bold' }}>
            Handscape
          </a>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link to={`/user-dashboard/${username}`} className="nav-link">Home</Link></li>
            <li className="nav-item"><Link to={`/products/${username}`} className="nav-link">Products</Link></li>
            <li className="nav-item"><Link to={`/cart/${username}`} className="nav-link">Cart</Link></li>
            <li className="nav-item"><Link to={`/orders/${username}`} className="nav-link active">Orders</Link></li>
            <li className="nav-item"><Link to="/login" className="nav-link">Logout ({username})</Link></li>
          </ul>
        </div>
      </nav>

      <div className="cart-content">
        <h2>Your Orders</h2>

        {orders.length > 0 ? (
          <div className="orders-container">
            {orders.map((order) => (
              <div 
                key={order._id} 
                className={`order-card ${order.status === 'Cancelled' ? 'cancelled' : ''}`}
              >
                <div className="order-header">
                  <span className="order-id">Order #{order._id.slice(-6).toUpperCase()}</span>
                  <span className={`order-status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="order-details">
                  <div className="order-meta">
                    <p><strong>Placed on:</strong> {formatDate(order.bookingDate)}</p>
                    <p><strong>Estimated Delivery:</strong> {formatDate(order.estimatedDelivery)}</p>
                    <p><strong>Seller:</strong> {order.sellerName}</p>
                    <p><strong>Payment ID:</strong> {order.paymentId}</p>
                  </div>
                  
                  <div className="order-items">
                    <h4>Items:</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-info">
                          <span className="item-name">{item.productName}</span>
                          <span className="item-quantity">Qty: {item.quantity}</span>
                        </div>
                        <span className="item-price">₹{item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="order-footer">
                  <div className="order-total">
                    <span>Total:</span>
                    <span>₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                  
                  {order.status === 'Pending' && (
                    <button 
                      className="cancel-btn"
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-cart">
            <p>You have no orders yet</p>
            <Link to={`/products/${username}`} className="shop-btn">Browse Products</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrder;