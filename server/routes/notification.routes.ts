import { Router } from "express";
import * as controller from "../controllers/notification.controller";
import { requireAuth } from "../middleware/auth.middleware";

export const notificationRouter = Router();
notificationRouter.use(requireAuth);

notificationRouter.get("/", controller.listNotifications);
notificationRouter.patch("/read-all", controller.markAllRead);
notificationRouter.patch("/:id/read", controller.markRead);
notificationRouter.delete("/:id", controller.removeNotification);
