import { Document, Schema } from "mongoose";

interface Task extends Document {
  title: string,
  description: string,
  date: Date,
  user: Schema.Types.ObjectId,
  createdAt?: Date,
  updatedAt?: Date
}

export default Task;