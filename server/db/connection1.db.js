import mongoose from "mongoose";

export const connectToDB = async ()=>{
  const MONGODB_URI = process.env.MONGODB_URI;
  const instance = await mongoose.connect(MONGODB_URI);
  console.log(`MongoDB connected: ${instance.connection.host}`);
}