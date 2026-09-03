const express = require('express');
const { body } = require('express-validator');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/category.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getCategories)
  .post([
    body('name').trim().notEmpty().withMessage('Category name is required'),
    body('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  ], createCategory);

router.route('/:id')
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;   