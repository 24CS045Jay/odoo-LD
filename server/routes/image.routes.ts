import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";
import {
  diskImageUpload,
  uploadImage,
  listImages,
  deleteImage,
  setCoverImage,
} from "../controllers/image.controller";

export const imageRouter = Router();

// Public / Authenticated read
imageRouter.get("/", requireAuth, listImages);

// Admin-only upload & delete
imageRouter.post("/upload", requireAuth, requireAdmin, diskImageUpload.single("file"), uploadImage);
imageRouter.delete("/:id", requireAuth, requireAdmin, deleteImage);
imageRouter.patch("/:entityType/:id/cover-image", requireAuth, requireAdmin, setCoverImage);
