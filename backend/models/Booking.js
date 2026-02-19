import mongoose from "mongoose";

const travelerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
});

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true },
    travelers: [travelerSchema],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled", "completed"], default: "pending" },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
