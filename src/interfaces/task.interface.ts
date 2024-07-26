import { Document } from "mongoose";

interface Task extends Document {
  title: string,
  description: string,
  date: Date
  createdAt?: Date,
  updatedAt?: Date
}

export default Task;