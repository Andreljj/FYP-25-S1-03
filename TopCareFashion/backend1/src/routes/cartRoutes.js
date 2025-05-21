import express from "express";
import protectRoute from "../middleware/auth.middleware.js";
import Cart from "../models/Cart.js";
import Listing from "../models/Listing.js";
import Purchase from "../models/Purchase.js";
import stripe from "../lib/stripe.js";


const router = express.Router();

// Get user's cart
router.get("/", protectRoute, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.listing");
  res.json(cart || { items: [] });
});

// Add item to cart
router.post("/add", protectRoute, async (req, res) => {
  const { listingId } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [{ listing: listingId }] });
  } else {
    const item = cart.items.find(i => i.listing.toString() === listingId);
    if (item) {
      // Already in cart, do nothing or return an error
      return res.status(409).json({ message: "This item is already in your cart." });
    } else {
      cart.items.push({ listing: listingId });
    }
  }

  await cart.save();
  const populatedCart = await Cart.findOne({ user: req.user._id }).populate("items.listing");
  res.json(populatedCart || { items: [] });
});

// Remove item
router.delete("/remove/:listingId", protectRoute, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter(i => i.listing.toString() !== req.params.listingId);
  await cart.save();
  const populatedCart = await Cart.findOne({ user: req.user._id }).populate("items.listing");
  res.json(populatedCart || { items: [] });
});

// Checkout
router.post("/checkout", protectRoute, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.listing");
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });

    const lineItems = cart.items.map(item => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.listing.title },
        unit_amount: Math.round(item.listing.price * 100)
      },
      quantity: item.quantity
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "topcarefashion://checkout-success",
      cancel_url: "topcarefashion://checkout-cancel",
      metadata: {
        userId: req.user._id.toString()
      }
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ message: "Payment failed", error: err.message });
  }
});

// After payment success, finalize purchase
router.post("/complete-checkout", protectRoute, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.listing");

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const purchaseItems = cart.items.map(item => ({
    listing: item.listing._id,
    quantity: item.quantity,
    price: item.listing.price,
  }));

  const purchase = new Purchase({
    user: req.user._id,
    items: purchaseItems,
    totalAmount: purchaseItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    paymentStatus: "Succeeded",
  });

  await purchase.save();

  // Optionally, clear the cart
  cart.items = [];
  await cart.save();

  res.status(201).json({ message: "Purchase recorded", purchase });
});


export default router;