import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  description: { required: true, type: String },
  completed: { required: true, type: Boolean },
  userId: { required: true, type: String }
});

export default mongoose.model('Todo', schema);