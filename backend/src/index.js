import express from "express";
import "dotenv/config"; // default: dotenv, go into config module

import authRoutes from "./routes/authRoutes.js"; // import authRoutes
import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 3000; // default is undefined

app.use(express.json()); // middleware to parse json data

app.use("/api/auth", authRoutes); // api route --> login, sign up

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});