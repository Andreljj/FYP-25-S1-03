import express from "express";
import "dotenv/config";

import authRoutes from "./routes/authRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js"; 
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
