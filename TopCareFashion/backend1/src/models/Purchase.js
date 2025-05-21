import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
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
        default: 1
      }
    }
  ],
  totalAmount: Number,
  paymentStatus: {
    type: String,
    enum: ["Succeeded", "Failed"],
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Purchase", purchaseSchema);
