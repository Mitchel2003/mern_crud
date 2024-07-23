import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost/mern-crud-db');
    console.log('Connected with database');
  } catch (e) { console.log('Error connect with database: ' + e) }
}
