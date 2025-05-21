import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  profileImage: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["User", "Admin"],
    default: "User",
  },
  bio: {
    type: String,
    default: "Hello Fashion enthusiast",
  },
  status: {
    type: String,
    enum: ["Active", "Suspended"],
    default: "Active",
  },
  dob: {
    type: String, // format: ddmmyyyy
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  bio: {
    type: String,
    default: "Hello Fashion enthusiast",
  },
  resetCode: {
    type: String
  }
}, { timestamps: true });

// Middleware: Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

export default mongoose.model("User", userSchema);
