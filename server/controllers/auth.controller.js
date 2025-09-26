import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import Request from "../models/request.model.js";
import { createNotification } from "../utils/createNotification.js";

export const signup = async (req, res) => {
  try {
    const { username, email, phone, locality, password } = req.body;

    if (!username || !email || !phone || !locality || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    if (username.length < 3 || username.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Username should be between 3 and 50 characters long.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format." });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid phone number." });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password should be at least 8 characters long.",
      });
    }

    if (await User.findOne({ username })) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists." });
    }
    if (await User.findOne({ email })) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists." });
    }
    if (await User.findOne({ phone })) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number already exists." });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      phone,
      locality,
      password: hashPassword,
      status: "pending",
      role: "user",
    });

    const newRequest = await Request.create({
      user: newUser._id,
      type: "account",
      status: "pending",
    });

    await createNotification({
      user: newUser._id,
      roleFor: "admin",
      type: "account",
      message: `${newUser.username} requested account approval`,
      request: newRequest._id,
    });

    const token = generateToken(newUser._id);

    const { password: _, ...safeUser } = newUser.toObject();

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        partitioned: true,
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "Signup successful. Waiting for admin approval.",
        token,
        user: safeUser,
      });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const user = await User.findOne({
      $or: [
        { phone: identifier },
        { username: identifier },
        { email: identifier },
      ],
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password." });
    }

    if (user.status === "rejected") {
      return res
        .status(401)
        .json({ success: false, message: "Account rejected by admin." });
    }

    const token = generateToken(user._id);

    const { password: _, ...safeUser } = user.toObject();

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        partitioned: true,
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({
        success: true,
        message: "Login success.",
        token,
        user: safeUser,
      });
    // }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// LOGOUT
export const logout = (req, res) => {
  // console.log(req.cookies);
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      partitioned: true,
      path: "/",
    })
    .status(200)
    .json({
      success: true,
      message: "Logged out successfully.",
    });
};

export const getMe = async (req, res) => {
  try {
    const user = req.user;
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
