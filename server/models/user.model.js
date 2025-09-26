import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: [true, "Username already exists."],
      lowercase: true,
      minlength: 3,
      maxlength: 50,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      unique: [true, "Phone number already exists."],
      minlength: 10,
      maxlength: 10,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      unique: [true, "Email address already exists."],
    },
    locality: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
