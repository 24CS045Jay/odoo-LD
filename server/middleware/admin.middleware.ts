import type { RequestHandler } from "express";
import { ApiError } from "../utils/apiResponse";

export const requireAdmin: RequestHandler = (req, _res, next) => {
  if (req.user?.role !== "admin") return next(new ApiError(403, "Administrator access required"));
  next();
};
