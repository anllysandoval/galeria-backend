import mongoose from 'mongoose';

const rolesSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    trim: true,
  },
});

export default mongoose.model('Role', rolesSchema);
