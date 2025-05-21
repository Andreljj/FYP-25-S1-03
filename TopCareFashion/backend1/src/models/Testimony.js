import mongoose from "mongoose";

const testimonySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  featured: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

const Testimony = mongoose.model("Testimony", testimonySchema);
export default Testimony;
