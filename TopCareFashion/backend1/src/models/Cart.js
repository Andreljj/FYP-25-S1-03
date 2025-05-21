import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  items: [
    {
      listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      }
    }
  ]
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);
