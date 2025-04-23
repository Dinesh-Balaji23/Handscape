const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const userRouter = require('./routes/userRoutes');
const sellerRouter = require('./routes/sellerRoutes');
const productRouter = require('./routes/productRoutes'); // Add this line

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

// Create uploads directory if it doesn't exist
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
app.use(productRouter); // Add this line

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});