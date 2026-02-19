import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema(
  {
    name: { type: mongoose.Schema.Types.Mixed, required: true, default: {} },
    description: { type: mongoose.Schema.Types.Mixed, default: {} },
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: "State", required: true },
    images: [{ type: String }],
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    categories: [{ type: String }],
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Destination", destinationSchema);
