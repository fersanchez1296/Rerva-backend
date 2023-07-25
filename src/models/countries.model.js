import mongoose from "mongoose";

const countrieSchema = mongoose.Schema(
  {
    "pais de la publicación": {
      type: String,
      trim: true,
    }
  },
);

export default mongoose.model("Countries", countrieSchema);
