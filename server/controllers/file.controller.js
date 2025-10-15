import { bucket } from "../config/firebase.js";
import { v4 as uuidv4 } from "uuid";
import File from "../models/file.model.js";
import { createNotification } from "../utils/createNotification.js";
import Request from "../models/request.model.js";
import { sendAdminEmails } from "../utils/sendAdminEmails.js";

export const getUploadUrl = async (req, res) => {
  try {
    const { fileName, fileType } = req.body;
    if (!fileName || !fileType) {
      return res
        .status(400)
        .json({ success: false, message: "fileName and fileType is required" });
    }

    const fileKey = `test/${Date.now()}-${uuidv4()}-${fileName}`;

    const file = bucket.file(fileKey);
    const [uploadUrl] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 5 * 60 * 1000,
      contentType: fileType,
    });

    res.json({ uploadUrl, fileKey });
  } catch (error) {
    console.error("Upload URL error:", error);
    res.status(500).json({ message: "Failed to generate upload URL" });
  }
};

export const saveMetadata = async (req, res) => {
  try {
    const { fileKey, originalName, fileSize, fileType, tags } = req.body;
    if (!fileKey) return res.status(400).json({ message: "fileKey required" });

    const fileDoc = {
      originalName,
      fileKey,
      fileSize,
      fileType,
      uploadedBy: req.user?._id,
      status: "pending",
      tags,
      createdAt: new Date(),
    };

    const data = await File.create(fileDoc);

    const fileObject = data.toObject();

    fileObject.uploadedBy = {
      username: req.user?.username,
      email: req.user?.email,
    };

    const newRequest = await Request.create({
      user: req.user?._id,
      file: data,
      type: "upload",
      status: "pending",
    });

    await createNotification({
      user: req.user?._id,
      roleFor: "admin",
      type: "upload",
      message: `${req.user?.username} requested to upload a file.`,
      request: newRequest._id,
    });

    await sendAdminEmails("New File Uploaded by User", "fileRequest", {
      username: req.user?.username,
      type: "upload",
      fileName: data.originalName,
      requestId: newRequest._id,
      date: new Date(newRequest.createdAt).toLocaleString([], {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    });

    res.json({ success: true, file: fileObject });
  } catch (error) {
    console.error("Save metadata error:", error);
    res.status(500).json({ message: "Failed to save metadata" });
  }
};

export const getDownloadUrl = async (req, res) => {
  try {
    const { fileKey } = req.query;
    if (!fileKey) return res.status(400).json({ message: "fileKey required" });

    const file = bucket.file(fileKey);
    const [downloadUrl] = await file.getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + 5 * 60 * 1000, // 5 min
    });

    res.json({ url: downloadUrl });
  } catch (error) {
    console.error("Download URL error:", error);
    res.status(500).json({ message: "Failed to generate download URL" });
  }
};

export const getAllFiles = async (req, res) => {
  try {
    const page = parseInt(req.query.page ?? "1", 10);
    const limit = parseInt(req.query.limit ?? "12", 10);
    const skip = (page - 1) * limit;

    const [files, total] = await Promise.all([
      File.find({ status: "approved" })
        .populate("uploadedBy", "username email")
        .sort({ uploadedAt: -1 })
        .skip(skip)
        .limit(limit),
      File.countDocuments({}),
    ]);

    res.status(200).json({
      success: true,
      data: files,
      pagination: {
        total,
        page,
        limit,
        hasMore: skip + files.length < total,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const searchFiles = async (req, res) => {
  try {
    const { query } = req.query;
    const page = parseInt(req.query.page ?? "1", 10);
    const limit = parseInt(req.query.limit ?? "12", 10);

    if (!query || !query.trim()) {
      return res.json({
        files: [],
        pagination: { total: 0, page, limit, hasMore: false },
      });
    }

    const searchRegex = new RegExp(query, "i");
    const filter = {
      $or: [
        { originalName: searchRegex },
        { fileType: searchRegex },
        { tags: searchRegex },
      ],
      status: "approved",
    };

    const skip = (page - 1) * limit;

    const [files, total] = await Promise.all([
      File.find(filter)
        .populate("uploadedBy", "username email")
        .sort({ uploadedAt: -1 })
        .skip(skip)
        .limit(limit),
      File.countDocuments(filter),
    ]);

    res.json({
      files,
      pagination: { total, page, limit, hasMore: skip + files.length < total },
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Error searching files" });
  }
};

export const getFileById = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findOne({
      _id: fileId,
    }).populate("uploadedBy", "username email");

    if (!file) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }

    if (file.status === "approved") {
      return res.json({ success: true, data: file });
    }

    if (file.status !== "approved" && req.user?.role !== "admin") {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }

    return res.json({ success: true, data: file });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const generateDownloadRequest = async (req, res) => {
  try {
    const { fileId } = req.params;
    if (!fileId) return res.status(400).json({ message: "Invalid file ID." });
    const file = await File.findOne({ _id: fileId });
    if (!file) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }

    const newRequest = await Request.create({
      user: req.user?._id,
      file,
      type: "download",
      status: "pending",
    });

    await createNotification({
      user: req.user?._id,
      roleFor: "admin",
      type: "download",
      message: `${req.user?.username} requested to download a file.`,
      request: newRequest._id,
    });

    await sendAdminEmails("User Requested to Download a File.", "fileRequest", {
      username: req.user?.username,
      type: "download",
      fileName: file.originalName,
      requestId: newRequest._id,
      date: new Date(newRequest.createdAt).toLocaleString([], {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    });

    res.json({
      success: true,
      message: "Download request sent. You will be notified once approved.",
      request: newRequest,
    });
  } catch (error) {
    console.error("Generate download request error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate download request.",
    });
  }
};
