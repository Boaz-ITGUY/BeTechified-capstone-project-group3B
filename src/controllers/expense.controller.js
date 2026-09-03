const Expense = require('../models/Expense');
const Category = require('../models/Category');
const { validationResult } = require('express-validator');

// @desc    Get all expenses for logged-in user (with filters)
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate, sort, page = 1, limit = 20 } = req.query;
    const query = { user: req.user._id };

    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const sortMap = {
      'date-desc': { date: -1 },
      'date-asc': { date: 1 },
      'amount-desc': { amount: -1 },
      'amount-asc': { amount: 1 },
    };
    const sortBy = sortMap[sort] || { date: -1 };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [expenses, total] = await Promise.all([
      Expense.find(query).populate('category', 'name type').sort(sortBy).skip(skip).limit(limitNum),
      Expense.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: expenses.length,
      total,
      pages: Math.ceil(total / limitNum),
      page: pageNum,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
const getExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id })
      .populate('category', 'name type');
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    res.json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { title, amount, category, date, notes } = req.body;

    // Verify category belongs to user
    const cat = await Category.findOne({ _id: category, user: req.user._id });
    if (!cat) {
      return res.status(400).json({ success: false, message: 'Invalid category' });
    }

    const expense = await Expense.create({ title, amount, category, date, notes, user: req.user._id });
    const populated = await expense.populate('category', 'name type');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    const { title, amount, category, date, notes } = req.body;

    if (category) {
      const cat = await Category.findOne({ _id: category, user: req.user._id });
      if (!cat) {
        return res.status(400).json({ success: false, message: 'Invalid category' });
      }
    }

    expense.title = title || expense.title;
    expense.amount = amount !== undefined ? amount : expense.amount;
    expense.category = category || expense.category;
    expense.date = date || expense.date;
    expense.notes = notes !== undefined ? notes : expense.notes;

    const updated = await expense.save();
    const populated = await updated.populate('category', 'name type');

    res.json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get expense summary / stats
// @route   GET /api/expenses/summary
// @access  Private
const getSummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const query = { user: req.user._id };

    if (month && year) {
      const start = new Date(parseInt(year), parseInt(month) - 1, 1);
      const end = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
      query.date = { $gte: start, $lte: end };
    }

    const [totalExpenses, byCategory, recentExpenses] = await Promise.all([
      Expense.aggregate([
        { $match: { user: req.user._id, ...(month && year ? { date: query.date } : {}) } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      Expense.aggregate([
        { $match: { user: req.user._id, ...(month && year ? { date: query.date } : {}) } },
        { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
        { $unwind: '$category' },
        { $project: { _id: 0, category: { _id: '$category._id', name: '$category.name', type: '$category.type' }, total: 1, count: 1 } },
        { $sort: { total: -1 } },
      ]),
      Expense.find({ user: req.user._id }).populate('category', 'name type').sort({ date: -1 }).limit(5),
    ]);

    res.json({
      success: true,
      data: {
        totalSpent: totalExpenses[0]?.total || 0,
        totalTransactions: totalExpenses[0]?.count || 0,
        byCategory,
        recentExpenses,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getExpenses, getExpense, createExpense, updateExpense, deleteExpense, getSummary };   