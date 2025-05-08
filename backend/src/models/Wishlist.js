import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  user: { //based on user we can see through the user ID
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true
  },
  listings: [{ //need to categorize and linked it with the listing to know the category easier  for the mix and match feature
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing"
  }]
}, { timestamps: true });

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
