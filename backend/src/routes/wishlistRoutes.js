import express from "express";
import Wishlist from "../models/Wishlist.js";
import protectRoute from "../middleware/auth.middleware.js"; // Ensure this points to your JWT middleware

const router = express.Router();

// 🧠 Get wishlist items grouped by category for Mix & Match
router.get("/mix-match", protectRoute, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate("listings");

    const grouped = {
      Top: [],
      Bottom: [],
      Footwear: []
    };

    if (wishlist) {
      wishlist.listings.forEach(item => {
        if (grouped[item.category]) {
          grouped[item.category].push(item);
        }
      });
    }

    res.status(200).json(grouped);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ➕ Add a listing to wishlist
router.post("/add/:listingId", protectRoute, async (req, res) => {
  try {
    const { listingId } = req.params;

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, listings: [listingId] });
    } else if (!wishlist.listings.includes(listingId)) {
      wishlist.listings.push(listingId);
    }

    await wishlist.save();
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ message: "Failed to add item", error: err.message });
  }
});

// ➖ Remove a listing from wishlist
router.delete("/remove/:listingId", protectRoute, async (req, res) => {
  try {
    const { listingId } = req.params;
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (wishlist) {
      wishlist.listings = wishlist.listings.filter(
        id => id.toString() !== listingId
      );
      await wishlist.save();
    }

    res.status(200).json(wishlist || { listings: [] });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove item", error: err.message });
  }
});

export default router;
