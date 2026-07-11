import mongoose from 'mongoose';

const splitSchema = new mongoose.Schema({
  member: { type: String, required: true }, // member name, or 'me'
  share: { type: Number, required: true, min: 0 }
});

const groupExpenseSchema = new mongoose.Schema(
  {
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true, index: true },
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    paidBy: { type: String, required: true }, // member name, or 'me'
    date: { type: Date, required: true, default: Date.now },
    splitType: { type: String, enum: ['equal', 'custom'], default: 'equal' },
    splits: { type: [splitSchema], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model('GroupExpense', groupExpenseSchema);
