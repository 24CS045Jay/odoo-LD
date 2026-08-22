import type { Model } from "mongoose";
import type { RequestHandler } from "express";
import { Activity } from "../models/Activity.model";
import { City } from "../models/City.model";
import { ApiError, ok } from "../utils/apiResponse";
import { getPagination, pageMeta } from "../utils/pagination";
import { getListQuery } from "../utils/queryFilters";

async function list(model: Model<any>, req: any, res: any, searchFields: string[], populate?: string) { const { page, limit, skip } = getPagination(req); const { mongoQuery, sort, groupBy } = getListQuery(req.query, searchFields); if (groupBy) { const groups = await model.aggregate([{ $match: mongoQuery }, { $group: { _id: `$${groupBy}`, items: { $push: "$$ROOT" } } }]); return res.json(ok({ groups })); } const [items, total] = await Promise.all([model.find(mongoQuery).sort(sort).skip(skip).limit(limit).populate(populate ?? ""), model.countDocuments(mongoQuery)]); res.json(ok({ items, pagination: pageMeta(page, limit, total) })); }
export const listCities: RequestHandler = (req, res) => list(City, req, res, ["name", "country", "region", "description"]);
export const getCity: RequestHandler = async (req, res) => { const city = await City.findById(req.params.id); if (!city) throw new ApiError(404, "City not found"); res.json(ok(city)); };
export const createCity: RequestHandler = async (req, res) => res.status(201).json(ok(await City.create(req.body), "City created"));
export const updateCity: RequestHandler = async (req, res) => { const city = await City.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!city) throw new ApiError(404, "City not found"); res.json(ok(city, "City updated")); };
export const deleteCity: RequestHandler = async (req, res) => { await City.findByIdAndDelete(req.params.id); res.json(ok({ deleted: true }, "City deleted")); };
export const listActivities: RequestHandler = (req, res) => list(Activity, req, res, ["name", "description", "category"], "city");
export const getActivity: RequestHandler = async (req, res) => { const activity = await Activity.findById(req.params.id).populate("city"); if (!activity) throw new ApiError(404, "Activity not found"); res.json(ok(activity)); };
export const createActivity: RequestHandler = async (req, res) => res.status(201).json(ok(await Activity.create(req.body), "Activity created"));
export const updateActivity: RequestHandler = async (req, res) => { const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!activity) throw new ApiError(404, "Activity not found"); res.json(ok(activity, "Activity updated")); };
export const deleteActivity: RequestHandler = async (req, res) => { await Activity.findByIdAndDelete(req.params.id); res.json(ok({ deleted: true }, "Activity deleted")); };
