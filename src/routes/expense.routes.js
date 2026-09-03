const express = require('express');
const { body } = require('express-validator');
const { getExpenses, getExpense, createExpense, updateExpense, deleteExpense, getSummary } = require('../controllers/expense.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/summary', getSummary);

router.route('/')
  .get(getExpenses)
  .post([
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
    body('category').isMongoId().withMessage('Valid category ID is required'),
  ], createExpense);

router.route('/:id')
  .get(getExpense)
  .put(updateExpense)
  .delete(deleteExpense);

module.exports = router; 