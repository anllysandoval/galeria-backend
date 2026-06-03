import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  auth0Id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  },
  role: {
    ref: 'Role',
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

export default mongoose.model('User', userSchema);
