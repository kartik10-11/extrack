import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }
});

const groupSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    // "me" (the logged-in owner) is always an implicit member alongside these
    members: { type: [memberSchema], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model('Group', groupSchema);
