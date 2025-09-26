import Request from "../models/request.model.js";
import User from "../models/user.model.js";
import { createNotification } from "../utils/createNotification.js";

//  Get Single Request
export const getRequestById = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await Request.findById(requestId)
      .populate("user", "username email phone locality status role createdAt")
      .populate("file", "name path size url createdAt")
      .populate("admin", "username email phone");

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    res.json({ success: true, data: request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//  Get All Pending Requests
export const getRequests = async (req, res) => {
  try {
    const requests = await Request.find({ status: "pending" })
      .populate("user", "username email phone locality role createdAt")
      .populate("file", "name path size createdAt");

    res.json({ success: true, data: { requests } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const approveRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    let request = await Request.findById(requestId)
      .populate("user")
      .populate("file");

    if (!request)
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });

    if (request.status === "approved")
      return res.status(404).json({
        success: false,
        message: "This request has been already approved.",
      });

    if (request.status === "rejected")
      return res.status(404).json({
        success: false,
        message: "This request has been already rejected.",
      });

    request.status = "approved";
    request.admin = req.user.id;
    await request.save();

    if (request.type === "account") {
      await User.findByIdAndUpdate(request.user._id, { status: "approved" });
    }
    if (request.type === "upload" && request.file) {
      request.file.isActive = true;
      await request.file.save();
    }

    request = await Request.findById(request._id)
      .populate({
        path: "user",
        select: "username email phone locality status createdAt role",
      })
      .populate("file")
      .populate({ path: "admin", select: "username email phone locality" });

    const newNotification = await createNotification({
      user: request.user._id,
      type: "system",
      message: `Your ${request.type} request has been approved.`,
      roleFor: "user",
      request: request._id,
    });

    res.json({
      success: true,
      message: "Request has been approved.",
      request,
    });
  } catch (err) {
    console.error("approveRequest error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Reject Request
export const rejectRequest = async (req, res) => {
  try {
    const { message } = req.body;
    const { requestId } = req.params;

    let request = await Request.findById(requestId)
      .populate("user")
      .populate("file");

    if (!request)
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });

    if (request.status === "approved")
      return res.status(404).json({
        success: false,
        message: "This request has been already approved.",
      });

    if (request.status === "rejected")
      return res.status(404).json({
        success: false,
        message: "This request has been already rejected.",
      });

    request.status = "rejected";
    request.admin = req.user.id;
    request.message = message;
    await request.save();

    if (request.type === "account") {
      await User.findByIdAndUpdate(request.user._id, { status: "rejected" });
    }
    if (request.type === "upload" && request.file) {
      request.file.isActive = false;
      await request.file.save();
    }

    request = await Request.findById(request._id)
      .populate({
        path: "user",
        select: "username email phone locality status createdAt role",
      })
      .populate("file")
      .populate({ path: "admin", select: "username email phone locality" });

    const newNotification = await createNotification({
      user: request.user._id,
      type: "system",
      message: `Your ${request.type} request was rejected.`,
      roleFor: "user",
      request: request._id,
    });

    res.json({
      success: true,
      message: "Request has been rejected.",
      request,
    });
  } catch (err) {
    console.error("rejectRequest error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
