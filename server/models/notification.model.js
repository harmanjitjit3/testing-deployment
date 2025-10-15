import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["account", "upload", "download", "system"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    roleFor: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    }, // who should see this
    isRead: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    }, // null for admin/system notifications
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
