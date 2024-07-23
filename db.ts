import mongoose from "mongoose";

export const connectionDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://avilesmaicol08:123.maicol@mern-crud-db.rnks6cx.mongodb.net/?retryWrites=true&w=majority&appName=mern-crud-db');
    console.log("connection sucessful");
  } catch (e) { console.log("Error to try conect with database: " + e) }
}