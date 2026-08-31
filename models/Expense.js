const mongoose = require('mongoose');

// Define the structure of an Expense
// This is like saying: "Each expense in the database must look like this"
const expenseSchema = new mongoose.Schema({
  // Description: What did you spend money on? (e.g., "Lunch at McDonald's")
  description: {
    type: String,           // Must be text
    required: true,         // MUST have a value (can't be empty)
    trim: true              // Remove extra spaces before/after
  },

  // Amount: How much money? (e.g., 15.50)
  amount: {
    type: Number,           // Must be a number
    required: true,         // MUST have a value
    min: 0                  // Can't be negative
  },

  // Category: What type of expense? (e.g., Food, Transport)
  category: {
    type: String,           // Must be text
    enum: [                 // Can ONLY be one of these values:
      'Food',
      'Transport',
      'Entertainment',
      'Utilities',
      'Healthcare',
      'Other'
    ],
    default: 'Other'        // If not specified, use 'Other'
  },

  // Date: When did you spend this? (e.g., 2026-08-31)
  date: {
    type: Date,             // Must be a date
    default: Date.now       // If not specified, use today's date
  },

  // Payment Method: How did you pay? (e.g., Cash, Card)
  paymentMethod: {
    type: String,           // Must be text
    enum: [                 // Can ONLY be one of these values:
      'Cash',
      'Credit Card',
      'Debit Card',
      'Digital Wallet'
    ],
    default: 'Cash'         // If not specified, use 'Cash'
  },

  // Notes: Any additional info? (optional)
  notes: {
    type: String,           // Must be text (if provided)
    trim: true              // Remove extra spaces
  },

  // Automatic: When was this created?
  createdAt: {
    type: Date,             // Must be a date
    default: Date.now       // Automatically set to now
  },

  // Automatic: When was this last updated?
  updatedAt: {
    type: Date,             // Must be a date
    default: Date.now       // Automatically set to now
  }
});

// Create and export the model
// This turns our schema into a usable model called "Expense"
module.exports = mongoose.model('Expense', expenseSchema);