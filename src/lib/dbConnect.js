import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is missing in environment variables!");
}

let cached = global.mongoose; 
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async () => {
  if (cached.conn) return cached.conn; 

  if (!cached.promise) {
    console.log("Connecting to MongoDB...");
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => {
      console.log("MongoDB Connected!");
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default dbConnect;
