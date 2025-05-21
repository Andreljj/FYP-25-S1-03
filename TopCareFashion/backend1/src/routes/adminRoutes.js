import express from "express";
import User from "../models/User.js";
import Listing from "../models/Listing.js";
import protectRoute from "../middleware/auth.middleware.js";
import isAdmin from "../middleware/isAdmin.middleware.js";

const router = express.Router();


// Get all users or filter by status (e.g., ?status=Active)
router.get("/users", protectRoute, isAdmin, async (req, res) => {
  try {
    const { status } = req.query;

    // Build query conditionally
    const query = status && status !== 'All' ? { status } : {};

    const users = await User.find(query).select("-password"); // exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
});


//Delete user by admin 
router.delete("/users/:id", protectRoute, isAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
});

// Public route to get basic stats for homepage and admin
router.get("/stats", async (req, res) => {
  try {
    const [userCount, listingCount] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments()
    ]);

    res.status(200).json({
      totalUsers: userCount,
      totalListings: listingCount
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats", error: error.message });
  }
});

// PATCH /api/admin/users/:id/status
router.patch("/users/:id/status", protectRoute, isAdmin, async (req, res) => {
  const { status } = req.body;

  // Validate allowed status values
  if (!["Active", "Suspended"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value. Must be 'Active' or 'Suspended'." });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: `User status updated to ${status}`,
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user status", error: err.message });
  }
});

// GET /api/admin/users/:id
router.get("/users/:id", protectRoute, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve user", error: err.message });
  }
});

export default router;
