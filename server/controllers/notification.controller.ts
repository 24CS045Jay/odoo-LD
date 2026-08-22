import type { RequestHandler } from "express";
import { Notification } from "../models/Notification.model";
import { ApiError, ok } from "../utils/apiResponse";

/** GET /api/notifications — list notifications for the current user */
export const listNotifications: RequestHandler = async (req, res) => {
  const userId = req.user!.id;
  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();
  const unreadCount = await Notification.countDocuments({ userId, read: false });
  res.json(ok({ items: notifications, unreadCount }));
};

/** PATCH /api/notifications/:id/read — mark one notification as read */
export const markRead: RequestHandler = async (req, res, next) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user!.id },
    { read: true },
    { new: true }
  ).lean();
  if (!notification) return next(new ApiError(404, "Notification not found"));
  res.json(ok(notification));
};

/** PATCH /api/notifications/read-all — mark all notifications as read */
export const markAllRead: RequestHandler = async (req, res) => {
  await Notification.updateMany({ userId: req.user!.id, read: false }, { read: true });
  res.json(ok({ updated: true }));
};

/** DELETE /api/notifications/:id — delete one notification */
export const removeNotification: RequestHandler = async (req, res, next) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    userId: req.user!.id,
  });
  if (!notification) return next(new ApiError(404, "Notification not found"));
  res.json(ok({ deleted: true }));
};
