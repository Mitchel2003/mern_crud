import mongoose from "mongoose";
import "dotenv/config"

export const connectionDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI ?? '');
    console.log("connection sucessful");
  } catch (e) { console.log("Error to try conect with database: " + e) }
}