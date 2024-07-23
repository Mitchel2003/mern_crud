import User from "../interfaces/user.interface";
import mongoose, { Schema } from "mongoose";

const userSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
})

export default mongoose.model('user', userSchema);