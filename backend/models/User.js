import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true } // stores a bcrypt hash, never the raw password
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
