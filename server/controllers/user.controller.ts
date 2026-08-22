import bcrypt from "bcryptjs";
import type { RequestHandler } from "express";
import { Activity } from "../models/Activity.model";
import { City } from "../models/City.model";
import { SavedDestination } from "../models/SavedDestination.model";
import { User } from "../models/User.model";
import { storagePut } from "../storage";
import { ApiError, ok } from "../utils/apiResponse";

function assertOwner(req: any) { if (req.user!.id !== req.params.id && req.user!.role !== "admin") throw new ApiError(403, "You can only manage your own account"); }
export const getUser: RequestHandler = async (req, res) => { const user = await User.findById(req.params.id); if (!user) throw new ApiError(404, "User not found"); res.json(ok(user)); };
export const updateUser: RequestHandler = async (req, res) => { assertOwner(req); const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!user) throw new ApiError(404, "User not found"); res.json(ok(user, "Profile updated")); };
export const deleteUser: RequestHandler = async (req, res) => { assertOwner(req); await User.findByIdAndDelete(req.params.id); await SavedDestination.deleteMany({ user: req.params.id }); res.json(ok({ deleted: true }, "Account deleted")); };
export const changePassword: RequestHandler = async (req, res) => { assertOwner(req); const user = await User.findById(req.params.id).select("+passwordHash"); if (!user) throw new ApiError(404, "User not found"); if (!(await bcrypt.compare(req.body.currentPassword, user.passwordHash))) throw new ApiError(401, "Current password is incorrect"); user.passwordHash = await bcrypt.hash(req.body.newPassword, 12); await user.save(); res.json(ok({ changed: true }, "Password updated")); };
export const uploadAvatar: RequestHandler = async (req, res) => { assertOwner(req); if (!req.file) throw new ApiError(422, "An image is required"); const uploaded = await storagePut(`users/${req.user!.id}/avatar-${req.file.originalname}`, req.file.buffer, req.file.mimetype); const user = await User.findByIdAndUpdate(req.params.id, { avatarUrl: uploaded.url, avatarKey: uploaded.key }, { new: true }); res.json(ok(user, "Profile photo updated")); };
export const listSaved: RequestHandler = async (req, res) => { assertOwner(req); const records = await SavedDestination.find({ user: req.params.id }).populate("city").populate("activity"); res.json(ok(records)); };
export const saveDestination: RequestHandler = async (req, res) => { assertOwner(req); const { cityId, activityId } = req.body; if (!cityId && !activityId) throw new ApiError(422, "A cityId or activityId is required"); if (cityId && !await City.exists({ _id: cityId })) throw new ApiError(404, "City not found"); if (activityId && !await Activity.exists({ _id: activityId })) throw new ApiError(404, "Activity not found"); const record = await SavedDestination.findOneAndUpdate({ user: req.params.id, ...(cityId ? { city: cityId } : { activity: activityId }) }, { user: req.params.id, ...(cityId ? { city: cityId } : { activity: activityId }) }, { upsert: true, new: true }); res.status(201).json(ok(record, "Destination saved")); };
export const removeSaved: RequestHandler = async (req, res) => { assertOwner(req); await SavedDestination.findOneAndDelete({ _id: req.params.destId, user: req.params.id }); res.json(ok({ deleted: true }, "Saved destination removed")); };
