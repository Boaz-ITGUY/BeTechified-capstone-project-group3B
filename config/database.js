const mongoose = require('mongoose');

// This function connects to MongoDB
const connectDB = async () => {
  try {
    // Get the database URL from environment variables
    // If none exists, use the local MongoDB default
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker';
    
    // Attempt to connect to MongoDB
    const conn = await mongoose.connect(mongoURI);
    
    // If successful, log a message
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    // If connection fails, log the error
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit the application if we can't connect
    process.exit(1);
  }
};

// Export the function so other files can use it
module.exports = connectDB;