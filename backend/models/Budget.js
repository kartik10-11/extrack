import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: { type: String, required: true, trim: true },
    month: { type: String, required: true }, // stored as 'YYYY-MM'
    limit: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

// One budget per category per month per user
budgetSchema.index({ user: 1, category: 1, month: 1 }, { unique: true });

export default mongoose.model('Budget', budgetSchema);
