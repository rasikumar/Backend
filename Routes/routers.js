// routes/index.js
import { Router } from "express";
import authRoutes from "./auth.routes.js";
const router = Router();

router.use("/auth", authRoutes); // /api/auth/signup, /api/auth/login

export default router;
