import mongoose from "mongoose";
import "dotenv/config"

const MONGODB_URI = process.env.MONGODB_URI as string;
export const connectionDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("connection sucessful");
  } catch (e) { console.log("Error to try conect with database: " + e) }
}