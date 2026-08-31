const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/database');  // Import database connection

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// ========== MIDDLEWARE ==========
// Allow requests from different websites
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Parse incoming form data
app.use(express.urlencoded({ extended: true }));

// ========== DATABASE CONNECTION ==========
// Connect to MongoDB when app starts
connectDB();

// ========== ROUTES ==========
// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: '💰 Expense Tracker API - Group 3B',
    status: 'Server is running ✅'
  });
});

// ========== START SERVER ==========
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});