import mongoose from "mongoose";

const stateSchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },
    regionId: { type: mongoose.Schema.Types.ObjectId, ref: "Region", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("State", stateSchema);
