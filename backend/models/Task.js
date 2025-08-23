import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  date: { type: String, required: true },
  startHour: { type: String, required: true },
  endHour: { type: String, required: true },
  finished: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
