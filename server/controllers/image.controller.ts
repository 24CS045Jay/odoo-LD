import fs from "fs";
import path from "path";
import crypto from "crypto";
import multer from "multer";
import type { Request, RequestHandler } from "express";
import { Image } from "../models/Image.model";
import { Trip } from "../models/Trip.model";
import { City } from "../models/City.model";
import { Activity } from "../models/Activity.model";
import { ApiError, ok } from "../utils/apiResponse";

const UPLOADS_ROOT = path.resolve(process.cwd(), "server", "uploads");

const allowedCategories = new Set(["trip", "city", "activity", "community", "avatar"]);
const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

const storage = multer.diskStorage({
  destination: (req: Request, _file, cb) => {
    const rawCategory = req.body?.category || req.query?.category || "trip";
    const category = allowedCategories.has(String(rawCategory)) ? String(rawCategory) : "trip";
    const dest = path.join(UPLOADS_ROOT, category === "trip" ? "trips" : `${category}s`);
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    cb(null, dest);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${crypto.randomUUID()}${ext}`;
    cb(null, safeName);
  },
});

export const diskImageUpload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(new ApiError(400, "Only JPEG, PNG, WebP, AVIF, and GIF images are allowed"));
    }
    cb(null, true);
  },
});

export const uploadImage: RequestHandler = async (req, res) => {
  if (!req.file) throw new ApiError(400, "No image file provided");
  const rawCategory = req.body.category || "trip";
  if (!allowedCategories.has(rawCategory)) {
    throw new ApiError(400, `Invalid category: ${rawCategory}. Allowed: ${Array.from(allowedCategories).join(", ")}`);
  }

  const categoryDir = rawCategory === "trip" ? "trips" : `${rawCategory}s`;
  const url = `/api/images/file/${categoryDir}/${req.file.filename}`;

  const imageDoc = await Image.create({
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    sizeBytes: req.file.size,
    category: rawCategory,
    entityId: req.body.entityId || undefined,
    uploadedBy: req.user!.id,
    url,
  });

  // If entityId was provided, attach to corresponding entity
  if (req.body.entityId) {
    if (rawCategory === "trip") {
      await Trip.findByIdAndUpdate(req.body.entityId, { coverImageUrl: url });
    } else if (rawCategory === "city") {
      await City.findByIdAndUpdate(req.body.entityId, { imageUrl: url });
    } else if (rawCategory === "activity") {
      await Activity.findByIdAndUpdate(req.body.entityId, { $push: { images: url } });
    }
  }

  res.status(201).json(ok(imageDoc, "Image uploaded successfully"));
};

export const listImages: RequestHandler = async (req, res) => {
  const query: Record<string, any> = {};
  if (req.query.category) query.category = req.query.category;
  if (req.query.entityId) query.entityId = req.query.entityId;

  const items = await Image.find(query).sort({ createdAt: -1 }).limit(100);
  res.json(ok({ items }));
};

export const deleteImage: RequestHandler = async (req, res) => {
  const image = await Image.findById(req.params.id);
  if (!image) throw new ApiError(404, "Image not found");

  // Remove file from disk
  const categoryDir = image.category === "trip" ? "trips" : `${image.category}s`;
  const filePath = path.join(UPLOADS_ROOT, categoryDir, image.filename);
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  } catch (err) {
    console.warn(`[Image Storage] Could not remove file on disk: ${filePath}`, err);
  }

  // Null out references in entities
  if (image.category === "trip") {
    await Trip.updateMany({ coverImageUrl: image.url }, { $unset: { coverImageUrl: "" } });
  } else if (image.category === "city") {
    await City.updateMany({ imageUrl: image.url }, { $unset: { imageUrl: "" } });
  } else if (image.category === "activity") {
    await Activity.updateMany({ images: image.url }, { $pull: { images: image.url } });
  }

  await image.deleteOne();
  res.json(ok({ deleted: true }, "Image deleted successfully"));
};

export const setCoverImage: RequestHandler = async (req, res) => {
  const { entityType, id } = req.params;
  const { imageId } = req.body;
  if (!imageId) throw new ApiError(400, "imageId is required");

  const image = await Image.findById(imageId);
  if (!image) throw new ApiError(404, "Image not found");

  if (entityType === "trips") {
    const updated = await Trip.findByIdAndUpdate(id, { coverImageUrl: image.url }, { new: true });
    if (!updated) throw new ApiError(404, "Trip not found");
    return res.json(ok(updated, "Trip cover updated"));
  } else if (entityType === "cities") {
    const updated = await City.findByIdAndUpdate(id, { imageUrl: image.url }, { new: true });
    if (!updated) throw new ApiError(404, "City not found");
    return res.json(ok(updated, "City image updated"));
  } else if (entityType === "activities") {
    const updated = await Activity.findByIdAndUpdate(id, { $addToSet: { images: image.url } }, { new: true });
    if (!updated) throw new ApiError(404, "Activity not found");
    return res.json(ok(updated, "Activity image updated"));
  }

  throw new ApiError(400, `Unsupported entity type: ${entityType}`);
};
