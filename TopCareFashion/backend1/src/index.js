import express from "express";
import "dotenv/config";

import authRoutes from "./routes/authRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js"; 
import testimonyRoutes from "./routes/testimonyRoutes.js";
import aboutUsRoutes from "./routes/aboutUsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Make sure this line is EXACTLY here
app.use(express.json({ limit: "10mb" }));

//Mount routes AFTER the middleware
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/faq", faqRoutes)
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/testimonyRoutes", testimonyRoutes);
app.use("/api/about", aboutUsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/search", searchRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

// Add a root route handler for the base URL
app.get("/", (req, res) => {
  res.json({
    message: "TopCare Fashion API",
    status: "online",
    version: "1.0",
    documentation: "Use /api/... endpoints to access the API",
    endpoints: [
      "/api/auth",
      "/api/listings",
      "/api/faq",
      "/api/wishlist",
      "/api/about",
      "/api/admin",
      "/api/user",
      "/api/cart",
      "/api/purchases",
      "/api/reviews",
      "/api/search"
    ]
  });
});

// Add a health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});