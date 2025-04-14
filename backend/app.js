const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRouter = require('./routes/userRoutes');
const sellerRouter = require('./routes/sellerRoutes');
const productRouter = require('./routes/productRoutes');
const orderRouter = require('./routes/orderRoutes');
const cartRouter = require('./routes/cartRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const paymentRouter = require('./routes/paymentRoutes');

const app = express();
const PORT = 9000;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
}));

mongoose.connect('mongodb://127.0.0.1:27017/Handscape')
    .then(() => {
        console.log('Connection to MongoDB established');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
    });

// Middleware and routes setup
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use(userRouter);       // For UserData
app.use(sellerRouter);     // For SellerData
app.use(productRouter);    // For Products
app.use(orderRouter);      // For Orders
app.use(cartRouter);       // For ShoppingCart
app.use(reviewRouter);     // For Reviews
app.use(paymentRouter);    // For Payments

// Start the server
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});