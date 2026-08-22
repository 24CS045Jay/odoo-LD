import { Router } from "express";
import { changePassword, deleteUser, getUser, listSaved, removeSaved, saveDestination, updateUser, uploadAvatar } from "../controllers/user.controller";
import { imageUpload } from "../config/multer";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { passwordSchema, profileSchema } from "../validators/auth.validator";
export const userRouter = Router();
userRouter.use(requireAuth); userRouter.get("/:id", getUser); userRouter.put("/:id", validate(profileSchema), updateUser); userRouter.delete("/:id", deleteUser); userRouter.put("/:id/password", validate(passwordSchema), changePassword); userRouter.post("/:id/avatar", imageUpload.single("image"), uploadAvatar); userRouter.get("/:id/saved-destinations", listSaved); userRouter.post("/:id/saved-destinations", saveDestination); userRouter.delete("/:id/saved-destinations/:destId", removeSaved);
