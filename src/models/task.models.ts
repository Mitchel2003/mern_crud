import Task from "../interfaces/task.interface";
import mongoose, { Schema } from "mongoose";

const taskSchema: Schema<Task> = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
}, { timestamps: true, versionKey: false })

export default mongoose.model('task', taskSchema);
