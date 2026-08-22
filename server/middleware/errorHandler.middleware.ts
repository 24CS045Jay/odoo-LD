import type { ErrorRequestHandler } from "express";
import { ApiError } from "../utils/apiResponse";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error?.name === "ValidationError") return res.status(422).json({ success: false, message: "Validation failed", errors: Object.values(error.errors).map((entry: any) => entry.message) });
  if (error?.code === 11000) return res.status(409).json({ success: false, message: "A record with this value already exists" });
  if (error?.name === "CastError") return res.status(400).json({ success: false, message: "Invalid resource identifier" });
  if (error?.name === "JsonWebTokenError" || error?.name === "TokenExpiredError") return res.status(401).json({ success: false, message: "Invalid or expired access token" });
  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  res.status(statusCode).json({ success: false, message: error instanceof ApiError ? error.message : "Unexpected server error", ...(error instanceof ApiError && error.errors ? { errors: error.errors } : {}) });
};
