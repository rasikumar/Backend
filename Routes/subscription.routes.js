import { Router } from "express";
import { Authenticate } from "../Middlewares/authMiddleware.js";
import { updateSubscription } from "../Controllers/subscription.controller.js";

const subscribeRouter = Router();

subscribeRouter.post("/update-subscription", Authenticate, updateSubscription);

export default subscribeRouter;
