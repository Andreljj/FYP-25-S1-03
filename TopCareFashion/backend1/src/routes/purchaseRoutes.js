import express from "express";
import protectRoute from "../middleware/auth.middleware.js";
import Purchase from "../models/Purchase.js";

const router = express.Router();

router.get("/my", protectRoute, async (req, res) => {
  const purchases = await Purchase.find({ user: req.user._id })
    .populate("items.listing")
    .sort({ createdAt: -1 });

  res.json(purchases);
});

export default router;
