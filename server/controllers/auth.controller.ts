import bcrypt from "bcryptjs";
import crypto from "crypto";
import type { RequestHandler } from "express";
import { User } from "../models/User.model";
import { ApiError, ok } from "../utils/apiResponse";
import { signAccessToken } from "../utils/jwt";
import { env } from "../config/env";

function authPayload(user: any) { return { token: signAccessToken({ id: user.id, role: user.role }), user: user.toJSON() }; }

export const register: RequestHandler = async (req, res) => {
  const exists = await User.exists({ email: req.body.email.toLowerCase() });
  if (exists) throw new ApiError(409, "An account already exists for this email address");
  const passwordHash = await bcrypt.hash(req.body.password, 12);
  const user = await User.create({ ...req.body, email: req.body.email.toLowerCase(), passwordHash });
  res.status(201).json(ok(authPayload(user), "Account created successfully"));
};

export const login: RequestHandler = async (req, res) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() }).select("+passwordHash");
  if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash))) throw new ApiError(401, "Invalid email or password");
  if (user.status !== "active") throw new ApiError(403, "This account is currently unavailable");
  res.json(ok(authPayload(user), "Signed in successfully"));
};

export const demoLogin: RequestHandler = async (_req, res) => {
  let user = await User.findOne({ email: "demo@worldtrotter.app" }).select("+passwordHash");
  if (!user) user = await User.create({ firstName: "Alex", lastName: "Morgan", email: "demo@worldtrotter.app", passwordHash: await bcrypt.hash("WorldTrotterDemo2026", 12), city: "Bengaluru", country: "India" });
  res.json(ok(authPayload(user), "Demo session started"));
};

export const me: RequestHandler = async (req, res) => {
  const user = await User.findById(req.user!.id);
  if (!user) throw new ApiError(404, "User not found");
  res.json(ok(user));
};

export const logout: RequestHandler = async (_req, res) => res.json(ok({ loggedOut: true }, "Signed out successfully"));

export const forgotPassword: RequestHandler = async (req, res) => {
  const user = await User.findOne({ email: String(req.body.email ?? "").toLowerCase() });
  let resetToken: string | undefined;
  if (user) { resetToken = crypto.randomBytes(32).toString("hex"); user.passwordResetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex"); user.passwordResetExpiresAt = new Date(Date.now() + 30 * 60 * 1000); await user.save(); }
  res.json(ok({ accepted: true, ...(env.NODE_ENV === "production" ? {} : { resetToken }) }, "If an account exists, reset instructions have been prepared"));
};
export const resetPassword: RequestHandler = async (req, res) => { const tokenHash = crypto.createHash("sha256").update(req.body.token).digest("hex"); const user = await User.findOne({ passwordResetTokenHash: tokenHash, passwordResetExpiresAt: { $gt: new Date() } }).select("+passwordHash +passwordResetTokenHash +passwordResetExpiresAt"); if (!user) throw new ApiError(400, "The reset link is invalid or has expired"); user.passwordHash = await bcrypt.hash(req.body.password, 12); user.passwordResetTokenHash = undefined; user.passwordResetExpiresAt = undefined; await user.save(); res.json(ok(authPayload(user), "Password reset successfully")); };
