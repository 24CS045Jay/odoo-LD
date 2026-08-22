import { Router } from "express";
import { copySharedTrip, getSharedTrip } from "../controllers/share.controller";
import { requireAuth } from "../middleware/auth.middleware";
export const shareRouter = Router(); shareRouter.get("/:shareToken", getSharedTrip); shareRouter.post("/:shareToken/copy", requireAuth, copySharedTrip);
