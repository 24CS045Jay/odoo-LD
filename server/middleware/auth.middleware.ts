import type { RequestHandler } from "express";
import { User } from "../models/User.model";
import { ApiError } from "../utils/apiResponse";
import { verifyAccessToken } from "../utils/jwt";

declare global { namespace Express { interface Request { user?: { id: string; role: "user" | "admin"; email: string }; } } }

export const requireAuth: RequestHandler = async (req, _res, next) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return next(new ApiError(401, "Authentication required"));
  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select("email role status");
    if (!user || user.status !== "active") return next(new ApiError(401, "Account is unavailable"));
    req.user = { id: user.id, role: user.role, email: user.email };
    next();
  } catch (error) { next(error); }
};
