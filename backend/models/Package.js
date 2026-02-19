import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    title: { type: mongoose.Schema.Types.Mixed, required: true, default: {} },
    description: { type: mongoose.Schema.Types.Mixed, default: {} },
    destinationId: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", required: true },
    duration: { type: String, default: "" },
    price: { type: Number, required: true },
    itinerary: [
      {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Package", packageSchema);
