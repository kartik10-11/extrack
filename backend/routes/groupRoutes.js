import express from 'express';
import { protect } from '../middleware/auth.js';
import Group from '../models/Group.js';
import GroupExpense from '../models/GroupExpense.js';
import Settlement from '../models/Settlement.js';
import { computeBalances } from '../utils/balances.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res) => {
  const groups = await Group.find({ owner: req.userId }).sort({ createdAt: -1 });
  res.json(groups);
});

router.post('/', async (req, res) => {
  try {
    const { name, members } = req.body; // members: [{ name }]
    const group = await Group.create({ owner: req.userId, name, members: members || [] });
    res.status(201).json(group);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/:id/members', async (req, res) => {
  const group = await Group.findOne({ _id: req.params.id, owner: req.userId });
  if (!group) return res.status(404).json({ message: 'Group not found' });
  group.members.push({ name: req.body.name });
  await group.save();
  res.json(group);
});

// Group detail page: members + expenses + settlements + computed balances, all in one call
router.get('/:id', async (req, res) => {
  const group = await Group.findOne({ _id: req.params.id, owner: req.userId });
  if (!group) return res.status(404).json({ message: 'Group not found' });

  const expenses = await GroupExpense.find({ group: group._id }).sort({ date: -1 });
  const settlements = await Settlement.find({ group: group._id }).sort({ date: -1 });

  const memberNames = ['me', ...group.members.map((m) => m.name)];
  const balances = computeBalances(memberNames, expenses, settlements);

  res.json({ group, expenses, settlements, balances });
});

router.post('/:id/expenses', async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.id, owner: req.userId });
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const { description, amount, paidBy, date, splitType, splits } = req.body;
    const expense = await GroupExpense.create({ group: group._id, description, amount, paidBy, date, splitType, splits });
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/:id/settlements', async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.id, owner: req.userId });
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const { from, to, amount, note } = req.body;
    const settlement = await Settlement.create({ group: group._id, from, to, amount, note });
    res.status(201).json(settlement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const group = await Group.findOneAndDelete({ _id: req.params.id, owner: req.userId });
  if (!group) return res.status(404).json({ message: 'Group not found' });
  await GroupExpense.deleteMany({ group: group._id });
  await Settlement.deleteMany({ group: group._id });
  res.json({ message: 'Deleted' });
});
// Edit member name
router.put('/:id/members/:memberId', async (req, res) => {
  try {
    if (!req.params.memberId || req.params.memberId === 'undefined') {
      return res.status(400).json({ message: 'Invalid member ID' });
    }
    const group = await Group.findOne({ _id: req.params.id, owner: req.userId });
    if (!group) return res.status(404).json({ message: 'Group not found' });
    const member = group.members.id(req.params.memberId);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    member.name = req.body.name;
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete member
router.delete('/:id/members/:memberId', async (req, res) => {
  try {
    if (!req.params.memberId || req.params.memberId === 'undefined') {
      return res.status(400).json({ message: 'Invalid member ID' });
    }
    const group = await Group.findOne({ _id: req.params.id, owner: req.userId });
    if (!group) return res.status(404).json({ message: 'Group not found' });
    group.members.pull({ _id: req.params.memberId });
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
export default router;
