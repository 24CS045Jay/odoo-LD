import multer from "multer";
import { ApiError } from "../utils/apiResponse";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) return callback(new ApiError(422, "Only JPEG, PNG, WebP, and GIF images are allowed"));
    callback(null, true);
  },
});
