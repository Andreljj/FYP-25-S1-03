import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ['Top', 'Bottom', 'Footwear'],
    required: true
  },
  color: { type: String, required: true },
  size: { type: String, required: true },
  condition: { type: String, required: true },
  gender: { type: String, required: true },
  image: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true }); // ✅ auto adds createdAt & updatedAt

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;