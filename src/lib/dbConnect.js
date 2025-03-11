import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  throw new Error("❌ MONGODB_URI is missing in environment variables!");
}

let cached = global.mongoose || { conn: null, promise: null };

const dbConnect = async () => {
  if (cached.conn) return cached.conn; 

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI)
      .then((mongoose) => {
        console.log("✅ MongoDB Connected!");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    global.mongoose = cached;
    return cached.conn;
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    throw new Error("Database connection failed");
  }
};

export default dbConnect;
