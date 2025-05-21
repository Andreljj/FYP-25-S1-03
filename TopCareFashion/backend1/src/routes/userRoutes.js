import express from "express";
import User from "../models/User.js";
import Listing from "../models/Listing.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

// GET full seller profile for public view
router.get("/seller/public/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("username profileImage bio followers following createdAt");
    if (!user) return res.status(404).json({ message: "User not found" });

    const listings = await Listing.find({ user: req.params.id }).sort({ createdAt: -1 });

    res.status(200).json({
      user: {
        username: user.username,
        profileImage: user.profileImage,
        bio: user.bio,
      },
      listings,
      listingsCount: listings.length
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch seller profile", error: error.message });
  }
});


// GET specific seller by ID (for buyer viewing seller profile)
router.get("/seller/:id", protectRoute, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Seller not found" });

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching seller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});


// ✅ Your own seller profile (protected)
router.get("/me/seller", protectRoute, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("username email bio phone address gender profileImage");

    const listings = await Listing.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      user,
      listings,
      listingsCount: listings.length
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your seller profile", error: error.message });
  }
});


export default router;
