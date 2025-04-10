// routes/auth.routes.js
import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  loginUser,
  registerUser,
  sendOtpForPasswordUpdate,
  updateUser,
  verifyOtpForPasswordUpdate,
} from "../Controllers/auth.controller.js";

import profileUpload from "../Middlewares/upload.js";

import { AdminOnly, Authenticate } from "../Middlewares/authMiddleware.js";

const authRoutes = Router();

// // @route   POST /api/auth/signup
authRoutes.post("/signup", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.put(
  "/updateUser/:id",
  Authenticate,
  profileUpload.single("profilePicture"),
  updateUser
);
authRoutes.get("/getUser/:id", Authenticate, getUserById);
authRoutes.delete("/deleteUser/:id", Authenticate, AdminOnly, deleteUser);
authRoutes.get("/getAllUsers", Authenticate, AdminOnly, getAllUsers);
authRoutes.post("/send-otp", sendOtpForPasswordUpdate);
authRoutes.post("/verify-otp-and-update", verifyOtpForPasswordUpdate);

export default authRoutes;
