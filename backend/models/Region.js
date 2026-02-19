import mongoose from "mongoose";

const regionSchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },
    icon: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Region", regionSchema);
