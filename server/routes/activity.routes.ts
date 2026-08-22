import { Router } from "express";
import { createActivity, deleteActivity, getActivity, listActivities, updateActivity } from "../controllers/catalog.controller";
import { requireAdmin } from "../middleware/admin.middleware";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { activitySchema } from "../validators/catalog.validator";
export const activityRouter = Router(); activityRouter.get("/", listActivities); activityRouter.get("/:id", getActivity); activityRouter.post("/", requireAuth, requireAdmin, validate(activitySchema), createActivity); activityRouter.put("/:id", requireAuth, requireAdmin, validate(activitySchema), updateActivity); activityRouter.delete("/:id", requireAuth, requireAdmin, deleteActivity);

