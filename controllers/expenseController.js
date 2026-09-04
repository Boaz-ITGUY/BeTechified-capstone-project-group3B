const Expense = require('../models/Expense');

// @desc    Get all expenses for logged-in user
// @route   GET /expenses
const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
        res.status(200).json({ success: true, count: expenses.length, data: expenses });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Create new expense
// @route   POST /expenses
const createExpense = async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;

        if (!title || !amount || !category) {
            return res.status(400).json({ success: false, message: 'Please provide title, amount, and category' });
        }

        const newExpense = await Expense.create({
            title,
            amount: Number(amount),
            category,
            date: date || undefined,
            user: req.user.id
        });

        res.status(201).json({ success: true, data: newExpense });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update an expense
// @route   PUT /expenses/:id
const updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found or unauthorized' });
        }

        res.status(200).json({ success: true, data: expense });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete an expense
// @route   DELETE /expenses/:id
const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });

        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found or unauthorized' });
        }

        res.status(200).json({ success: true, message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

module.exports = { getExpenses, createExpense, updateExpense, deleteExpense };