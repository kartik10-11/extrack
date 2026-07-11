import mongoose from 'mongoose';

const settlementSchema = new mongoose.Schema(
  {
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true, index: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true, default: Date.now },
    note: { type: String, trim: true, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('Settlement', settlementSchema);
