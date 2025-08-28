/**
 * Bookstore Order Management System - Server
 * Implements queue-based order processing with sorting and search algorithms
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Database Connection
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connection successful'))
.catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/users', require('./api/routes/userRoutes'));
app.use('/api/books', require('./api/routes/bookRoutes'));
app.use('/api/orders', require('./api/routes/orderRoutes'));
app.use('/api/algorithms', require('./api/routes/algorithmRoutes'));

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
