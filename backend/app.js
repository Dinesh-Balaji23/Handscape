const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRouter = require('./routes/userRoutes');
const sellerRouter = require('./routes/sellerRoutes');

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


app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use(userRouter);
app.use(sellerRouter);

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});