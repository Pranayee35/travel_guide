import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/incredible-india");
  const email = process.env.ADMIN_EMAIL || "admin@incredibleindia.com";
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: "Admin",
      email,
      password: process.env.ADMIN_PASSWORD || "admin123",
      role: "admin",
    });
    console.log("Admin created:", user.email);
  } else {
    user.role = "admin";
    await user.save();
    console.log("Admin updated:", user.email);
  }
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
