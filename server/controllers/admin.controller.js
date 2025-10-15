import User from "../models/user.model.js";

export const findAdmin = async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier)
      return res
        .status(400)
        .json({ success: false, message: "Identifier required" });

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

export const addNewAdmin = async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier)
      return res
        .status(400)
        .json({ success: false, message: "Identifier required" });

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.role === "admin") {
      return res
        .status(400)
        .json({ success: false, message: "User is already an admin" });
    }

    user.role = "admin";
    await user.save();

    const updatedUser = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select("-password");

    return res.json({
      success: true,
      message: "Admin added successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
