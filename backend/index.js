const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
  {
    origin: ['http://localhost:5000', 'https://shopz-iv59.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }
));
app.get('/', (req, res) => {
  res.send('shopZ is working!');
});

app.use('/api/auth', authRoutes);
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));


const PORT = process.env.PORT || 5000;
if(process.env.NODE_ENV === 'production') {
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
}