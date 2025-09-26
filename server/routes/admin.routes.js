import express from "express";
import { findAdmin, addNewAdmin } from "../controllers/admin.controller.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add-admin", isAuthenticated, isAdmin, addNewAdmin);

router.post("/find-admin", isAuthenticated, isAdmin, findAdmin);

export default router;
