// routes/auth.routes.js
import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  loginUser,
  registerUser,
  updateUser,
} from "../Controllers/auth.controller.js";

import profileUpload from "../Middlewares/upload.js";

import { AdminOnly, Authenticate } from "../Middlewares/authMiddleware.js";

const authRoutes = Router();

// // @route   POST /api/auth/signup
authRoutes.post("/signup", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.put(
  "/updateUser/:id",
  profileUpload.single("profilePicture"),
  updateUser
);
authRoutes.delete("/deleteUser/:id", Authenticate, AdminOnly, deleteUser);
authRoutes.get("/getAllUsers", Authenticate, AdminOnly, getAllUsers);

export default authRoutes;
