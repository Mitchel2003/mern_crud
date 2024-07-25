import mongoose from "mongoose";
import { MONGODB_URI } from "./config"

export const connectionDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("connection sucessful");
  } catch (e) { console.log("Error to try conect with database: " + e) }
}