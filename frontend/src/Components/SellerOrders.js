import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './CSS/SellerOrders.css';
import { FaBoxOpen, FaShippingFast, FaCheckCircle, FaTimesCircle, FaFilter } from 'react-icons/fa';

const SellerOrders = () => {
  const { sellername } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/orders/seller-orders/${sellername}`);
        setOrders(response.data);
        setError(null);
      } catch (error) {
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [sellername]);

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status.toLowerCase() === filter.toLowerCase();
  });

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch('http://localhost:9000/orders/status', { orderId, status: newStatus });
      setOrders(orders.map(order => (order._id === orderId ? { ...order, status: newStatus } : order)));
    } catch {
      alert('Failed to update order status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <FaBoxOpen className="status-icon pending" />;
      case 'Shipped': return <FaShippingFast className="status-icon shipped" />;
      case 'Delivered': return <FaCheckCircle className="status-icon delivered" />;
      case 'Cancelled': return <FaTimesCircle className="status-icon cancelled" />;
      default: return <FaBoxOpen className="status-icon" />;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="seller-orders-container">
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: 'black' }}>
        <div className="container">
          <a className="navbar-brand" href={`/seller-dashboard/${sellername}`} style={{ color: 'orange', fontWeight: 'bold' }}>
            Handscape (Seller)
          </a>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link to={`/seller-dashboard/${sellername}`} className="nav-link">Home</Link></li>
            <li className="nav-item"><Link to={`/addproduct/${sellername}`} className="nav-link">Add Product</Link></li>
            <li className="nav-item"><Link to={`/seller-orders/${sellername}`} className="nav-link active">Orders</Link></li>
            <li className="nav-item"><Link to="/login" className="nav-link">Logout ({sellername})</Link></li>
          </ul>
        </div>
      </nav>

      <div className="orders-content container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2>Your Orders</h2>
            <p className="seller-name">Seller: {sellername}</p>
          </div>

          <div className="filter-container">
            <div className="filter-dropdown">
              <button
                className="action-btn dropdown-toggle"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <FaFilter className="filter-icon" /> &nbsp;
                <span>{statusOptions.find(opt => opt.value === filter)?.label}</span> &nbsp;
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu show">
                  {statusOptions.map(option => (
                    <button
                      key={option.value}
                      className={`dropdown-item ${filter === option.value ? 'active' : ''}`}
                      onClick={() => {
                        setFilter(option.value);
                        setDropdownOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <p>No {filter === 'all' ? '' : filter} orders found</p>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map(order => (
              <div key={order._id} className={`order-card ${order.status.toLowerCase()}`}>
                <div className="order-header">
                  <div className="order-id">Order #{order._id.slice(-6).toUpperCase()}</div>
                  <div className="order-status">
                    {getStatusIcon(order.status)}
                    <span className={`status-text ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="order-details">
                  <div className="customer-info">
                    <p><strong>Customer:</strong> {order.userName}</p>
                    <p><strong>Order Date:</strong> {formatDate(order.bookingDate)}</p>
                    <p><strong>Estimated Delivery:</strong> {formatDate(order.estimatedDelivery)}</p>
                  </div>

                  <div className="items-list">
                    <h4>Items:</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-info">
                          <span className="item-name">{item.productName}</span>
                          <span className="item-quantity">Qty: {item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-total">
                    <span>Total:</span>
                    <span>₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="order-actions">
                  {order.status === 'Pending' && (
                    <>
                      <button
                        className="action-btn ship-btn"
                        onClick={() => updateOrderStatus(order._id, 'Shipped')}
                      >
                        Mark as Shipped
                      </button>
                      <button
                        className="action-btn cancel-btn"
                        onClick={() => updateOrderStatus(order._id, 'Cancelled')}
                      >
                        Cancel Order
                      </button>
                    </>
                  )}
                  {order.status === 'Shipped' && (
                    <button
                      className="action-btn deliver-btn"
                      onClick={() => updateOrderStatus(order._id, 'Delivered')}
                    >
                      Mark as Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOrders;
