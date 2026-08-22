import { Router } from "express";
import * as controller from "../controllers/admin.controller";
import { requireAdmin } from "../middleware/admin.middleware";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { userRoleSchema, userStatusSchema } from "../validators/community.validator";
export const adminRouter = Router(); adminRouter.use(requireAuth, requireAdmin); adminRouter.get("/users", controller.listUsers); adminRouter.put("/users/:id/status", validate(userStatusSchema), controller.updateUserStatus); adminRouter.put("/users/:id/role", validate(userRoleSchema), controller.updateUserRole); adminRouter.delete("/users/:id", controller.deleteAdminUser); adminRouter.get("/cities/popular", controller.popularCities); adminRouter.get("/activities/popular", controller.popularActivities); adminRouter.get("/analytics", controller.analytics);

