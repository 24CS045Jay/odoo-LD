import type { RequestHandler } from "express";
import { Activity } from "../models/Activity.model";
import { City } from "../models/City.model";
import { SavedDestination } from "../models/SavedDestination.model";
import { Trip } from "../models/Trip.model";
import { User } from "../models/User.model";
import { ApiError, ok } from "../utils/apiResponse";
import { getPagination, pageMeta } from "../utils/pagination";
import { getListQuery } from "../utils/queryFilters";

export const listUsers: RequestHandler = async (req, res) => { const { page, limit, skip } = getPagination(req); const { mongoQuery, sort } = getListQuery(req.query, ["firstName", "lastName", "email", "city", "country"]); const [items, total] = await Promise.all([User.find(mongoQuery).sort(sort).skip(skip).limit(limit), User.countDocuments(mongoQuery)]); res.json(ok({ items, pagination: pageMeta(page, limit, total) })); };
export const updateUserStatus: RequestHandler = async (req, res) => { const user = await User.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }); if (!user) throw new ApiError(404, "User not found"); res.json(ok(user, "User status updated")); };
export const updateUserRole: RequestHandler = async (req, res) => { const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }); if (!user) throw new ApiError(404, "User not found"); res.json(ok(user, "User role updated")); };
export const deleteAdminUser: RequestHandler = async (req, res) => { await User.findByIdAndDelete(req.params.id); res.json(ok({ deleted: true }, "User deleted")); };
export const popularCities: RequestHandler = async (_req, res) => { const items = await Trip.aggregate([{ $unwind: "$destinations" }, { $group: { _id: "$destinations.city", tripCount: { $sum: 1 }, userCount: { $addToSet: "$owner" } } }, { $project: { name: "$_id", tripCount: 1, userCount: { $size: "$userCount" } } }, { $sort: { tripCount: -1 } }, { $limit: 20 }]); res.json(ok(items)); };
export const popularActivities: RequestHandler = async (_req, res) => { const items = await Activity.find().sort({ popularityScore: -1 }).limit(20).populate("city", "name country"); res.json(ok(items)); };
export const analytics: RequestHandler = async (_req, res) => {
  const [totalUsers, activeUsers, totalTrips, budget] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ status: "active" }),
    Trip.countDocuments(),
    Trip.aggregate([{ $group: { _id: null, avgBudget: { $avg: "$budget" }, avgTripDuration: { $avg: { $dateDiff: { startDate: "$startDate", endDate: "$endDate", unit: "day" } } } } }]),
  ]);
  const popularDestinations = await Trip.aggregate([{ $unwind: "$destinations" }, { $group: { _id: "$destinations.city", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 8 }]);
  const savedCount = await SavedDestination.countDocuments();
  res.json(ok({ totalUsers, activeUsers, totalTrips, savedDestinations: savedCount, averageBudget: budget[0]?.avgBudget ?? 0, averageTripDuration: budget[0]?.avgTripDuration ?? 0, popularDestinations }));
};
