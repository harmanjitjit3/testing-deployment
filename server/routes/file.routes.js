import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  getUploadUrl,
  saveMetadata,
  getDownloadUrl,
  searchFiles,
  getAllFiles,
  getFileById,
  generateDownloadRequest,
} from "../controllers/file.controller.js";

const router = express.Router();

router.get("/", isAuthenticated, getAllFiles);
router.post("/get-upload-url", isAuthenticated, getUploadUrl);
router.post("/save-metadata", isAuthenticated, saveMetadata);
router.get("/get-download-url", isAuthenticated, getDownloadUrl);
router.get("/search", isAuthenticated, searchFiles);
router.get("/detail/:fileId", isAuthenticated, getFileById);
router.get("/download/:fileId", isAuthenticated, generateDownloadRequest);

export default router;
