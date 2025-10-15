import express from "express";
import { getMe, login, logout, signup } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", login);

router.post("/signup", signup);

router.post("/logout", isAuthenticated, logout);

router.get("/me", isAuthenticated, getMe);

export default router;
