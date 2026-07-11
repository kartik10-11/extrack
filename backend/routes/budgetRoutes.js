import express from 'express';
import { protect } from '../middleware/auth.js';
import Budget from '../models/Budget.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res) => {
  try {
    const { month } = req.query;
    const filter = { user: req.userId };
    if (month) filter.month = month;
    const budgets = await Budget.find(filter);
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Creating a budget for a category/month that already exists just updates it (upsert)
router.post('/', async (req, res) => {
  try {
    const { category, month, limit } = req.body;
    const budget = await Budget.findOneAndUpdate(
      { user: req.userId, category, month },
      { limit },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(201).json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
