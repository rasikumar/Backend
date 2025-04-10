import { Router } from "express";
import {
  getAllProgress,
  getAllUsersProgress,
  markDayAsSaved,
} from "../Controllers/saving.controller.js";
import { Authenticate } from "../Middlewares/authMiddleware.js";

const savingsRouter = Router();

savingsRouter.post("/update-savings", Authenticate, markDayAsSaved);
savingsRouter.post("/getprogress", Authenticate, getAllProgress);
savingsRouter.post("/getAllUsersProgress", Authenticate, getAllUsersProgress);

export default savingsRouter;
