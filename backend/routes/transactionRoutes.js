import express from 'express';
import { protect } from '../middleware/auth.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();
router.use(protect); // every route below requires a valid login

// GET /api/transactions?type=&category=&from=&to=&search=
router.get('/', async (req, res) => {
  try {
    const { type, category, from, to, search } = req.query;
    const filter = { user: req.userId };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }
    if (search) {
      filter.$or = [
        { note: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { type, amount, category, date, note } = req.body;
    const transaction = await Transaction.create({ user: req.userId, type, amount, category, date, note });
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json(transaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
