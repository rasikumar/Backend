// routes/index.js
import { Router } from "express";
import authRoutes from "./auth.routes.js";
import subscribeRouter from "./subscription.routes.js";
import savingsRouter from "./savings.routes.js";
const router = Router();

router.use("/auth", authRoutes); // /api/auth/signup, /api/auth/login
router.use("/subscribe", subscribeRouter); // /api/auth/signup, /api/auth/login
router.use("/savings", savingsRouter); // /api/savings/create-savings, /api/savings/get-savings

export default router;
