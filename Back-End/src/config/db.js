const mongoose = require("mongoose");

let isConnecting = false;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (isConnecting) {
    return;
  }

  try {
    isConnecting = true;
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
      process.exit(1);
    }
  } finally {
    isConnecting = false;
  }
};

module.exports = connectDB;