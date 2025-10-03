import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './CSS/Cart.css';

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Cart = () => {
  const { username } = useParams();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/cart/${username}`);
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
      await axios.delete(`http://localhost:8000/cart/remove/${productId}`, { data: { username } });
      setCartItems(cartItems.filter(item => item.productId !== productId));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + Number(item.price) * item.quantity, 0);

  const handlePayment = async (totalAmount, username) => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Check your connection.");
      return;
    }
    try {
      const razorpayResponse = await axios.post(`http://localhost:8000/cart/${username}/razorpay`, { totalAmount, username });
      const { amount, id: orderid, currency } = razorpayResponse.data.order;

      const options = {
        key: "rzp_test_8qY0PPemsA7yUW",
        amount: amount.toString(),
        currency,
        name: "Handscape",
        description: "Order Payment",
        orderid,
        handler: async function (response) {
          alert("✅ Payment successful!");
          try {
              // Prepare order data with seller info
              const orderData = {
                  userId: username,
                  userName: username,
                  paymentId: response.razorpay_paymentid,
                  razorpayOrderId: orderid,
                  cartItems: cartItems.map(item => ({
                      productId: item.productId,
                      productName: item.productName,
                      price: Number(item.price),
                      quantity: item.quantity,
                      sellerId: item.sellerId || 1,  // fallback if undefined
                      sellerName: item.sellerName || "Handscape"
                  })),
                  totalAmount: totalPrice,
                  status: "Pending"
              };

              // Await the POST request before redirecting
              await axios.post("http://localhost:8000/orders", orderData);

              // Clear cart
              await axios.delete(`http://localhost:8000/cart/clear/${username}`);

              // Redirect only after backend operations are complete
              window.location.href = `/orders/${username}`;
          } catch (err) {
              window.location.href = `/orders/${username}`;
          }
      },
        prefill: { name: username, email: "test@example.com", contact: "9999999999" },
        theme: { color: "#000000" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Payment initiation failed");
    }
  };

  if (loading) return <div className="loading">Loading cart...</div>;

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
            <li className="nav-item"><Link to={`/cart/${username}`} className="nav-link active">Cart</Link></li>
            <li className="nav-item"><Link to={`/orders/${username}`} className="nav-link">Orders</Link></li>
            <li className="nav-item"><Link to="/login" className="nav-link">Logout ({username})</Link></li>
          </ul>
        </div>
      </nav>

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

              {cartItems.map(item => (
                <div className="cart-row" key={item.id}>
                  <div className="cart-cell product-info">
                    <span className="product-name">{item.productName}</span>
                  </div>
                  <div className="cart-cell">₹{Number(item.price).toFixed(2)}</div>
                  <div className="cart-cell">{item.quantity}</div>
                  <div className="cart-cell">₹{(Number(item.price) * item.quantity).toFixed(2)}</div>
                  <div className="cart-cell">
                    <button className="remove-btn" onClick={() => handleRemoveFromCart(item.productId)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="total-section">
                <h3>Order Summary</h3>
                <div className="total-row"><span>Subtotal:</span><span>₹{totalPrice.toFixed(2)}</span></div>
                <div className="total-row"><span>Shipping:</span><span>FREE</span></div>
                <div className="total-row grand-total"><span>Total:</span><span>₹{totalPrice.toFixed(2)}</span></div>
                <button className="checkout-btn" onClick={() => handlePayment(totalPrice, username)}>Pay Now</button>
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