import Request from "../models/request.model.js";
import User from "../models/user.model.js";
import File from "../models/file.model.js";
import { createNotification } from "../utils/createNotification.js";
import { sendEmail } from "../services/email.service.js";

//  Get Single Request
export const getRequestById = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await Request.findOne({
      _id: requestId,
      user: { $ne: req.user._id },
    })
      .populate("user", "-password")
      .populate("file")
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

// get user request
export const getUserRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const requests = await Request.find({
      user: userId,
      type: { $ne: "account" },
    })
      .populate("file")
      .populate("admin", "username email phone")
      .sort({ createdAt: -1 });

    if (!requests) {
      f;
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    res.json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// get all requests
export const getRequests = async (req, res) => {
  const { status } = req.params;
  const ALLOWED_STATUSES = ["pending", "rejected", "approved"];
  try {
    if (status !== "all" && !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status parameter. Must be 'all' or one of: ${ALLOWED_STATUSES.join(", ")}.`,
      });
    }
    const query = {
      user: { $ne: req.user._id },
    };

    if (status !== "all") {
      query.status = status;
    }

    const requests = await Request.find(query)
      .populate("user", "-password")
      .populate("file", "name path size createdAt")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: { requests } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Approve request
export const approveRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    let request = await Request.findById(requestId)
      .populate("user", "-password")
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
      await User.findByIdAndUpdate(request.user._id, {
        status: "approved",
        approvedAt: Date.now(),
      });
    }

    if (request.type === "upload" && request.file) {
      await File.findByIdAndUpdate(request.file._id, { status: "approved" });
    }

    request = await Request.findById(request._id)
      .populate({
        path: "user",
        select: "-password",
      })
      .populate("file")
      .populate({ path: "admin", select: "username email phone locality" });

    const notifyMessage =
      request.type === "account"
        ? "Your account has been approved."
        : `Your ${request.type} request has been approved.`;

    const newNotification = await createNotification({
      user: request.user._id,
      type: request.type,
      message: notifyMessage,
      roleFor: "user",
      request: request._id,
    });

    let template = "";
    let variables = {};

    if (request.type === "account") {
      template = "accountApproved";
      variables.username = request.user?.username;
    } else {
      template = "fileApproved";
      variables.activity = request.type;
      variables.username = request.user?.username;
      variables.fileName = request.file?.originalName;
      variables.fileId = request.file?._id;
      variables.type = request.type;
      variables.tags = request.file?.tags;
    }

    if (request.user?.email) {
      await sendEmail(request.user?.email, notifyMessage, template, variables);
    }

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
      .populate("user", "-password")
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
      await File.findByIdAndUpdate(request.file._id, { status: "rejected" });
    }

    request = await Request.findById(request._id)
      .populate({
        path: "user",
        select: "-password",
      })
      .populate("file")
      .populate({ path: "admin", select: "username email phone locality" });

    const notifyMessage =
      request.type === "account"
        ? "Your account has been rejected."
        : `Your ${request.type} request has been rejected.`;

    const newNotification = await createNotification({
      user: request.user._id,
      type: request.type,
      message: notifyMessage,
      roleFor: "user",
      request: request._id,
    });

    let template = "";
    let variables = {};
    if (request.type === "account") {
      template = "accountRejected";
      variables.username = request.user?.username;
      variables.reason = message;
    } else {
      template = "fileRejected";
      variables.username = request.user?.username;
      variables.fileName = request.file?.originalName;
      variables.fileId = request.file?._id;
      variables.type = request.type;
      variables.reason = message;
    }

    if (request.user?.email) {
      await sendEmail(request.user?.email, notifyMessage, template, variables);
    }

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
