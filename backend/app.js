const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const userRouter = require('./routes/userRoutes');
const sellerRouter = require('./routes/sellerRoutes');
const productRouter = require('./routes/productRoutes');
const cartRouter = require('./routes/cartRoutes');
const orderRouter = require('./routes/orderRoutes'); // Ensure this is included


const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Explicitly include PATCH
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

mongoose.connect(process.env.MONGO_URI || "mongodb+srv://Dineshbalaji_A:dineshbalaji@cluster0.cwoq1.mongodb.net/Handscape?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log("MongoDB connected successfully via Mongoose"))
.catch((err) => console.error("MongoDB connection error:", err.message));


const fs = require('fs');
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(userRouter);
app.use(sellerRouter);
app.use(productRouter);
app.use(cartRouter);
app.use(orderRouter);

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
