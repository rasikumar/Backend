import { Router } from "express";
import {
  getAllEntries,
  getAllProgress,
  getAllUsersProgress,
  markDayAsSaved,
} from "../Controllers/saving.controller.js";
import { Authenticate } from "../Middlewares/authMiddleware.js";

const savingsRouter = Router();

savingsRouter.post("/update-savings", Authenticate, markDayAsSaved);
savingsRouter.post("/getprogress", Authenticate, getAllProgress);
savingsRouter.post("/getAllUsersProgress", Authenticate, getAllUsersProgress);
savingsRouter.get("/get-entries", Authenticate, getAllEntries);

export default savingsRouter;
