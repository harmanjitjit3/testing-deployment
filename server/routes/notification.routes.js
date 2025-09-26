import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  getNotifications,
} from "../controllers/notificaton.controller.js";

const router = express.Router();

router.get("/", isAuthenticated, getNotifications);

export default router;
