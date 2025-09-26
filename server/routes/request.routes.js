import express from "express";
import {
  getRequests,
  getRequestById,
  approveRequest,
  rejectRequest,
} from "../controllers/request.controller.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", isAuthenticated, isAdmin, getRequests);

router.get("/detail/:requestId", isAuthenticated, isAdmin, getRequestById);

router.put("/:requestId/approve", isAuthenticated, isAdmin, approveRequest);

router.put("/:requestId/reject", isAuthenticated, isAdmin, rejectRequest);

export default router;
