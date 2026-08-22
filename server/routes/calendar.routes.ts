import { Router } from "express";
import { getCalendar } from "../controllers/trip.controller";
import { requireAuth } from "../middleware/auth.middleware";
export const calendarRouter = Router(); calendarRouter.get("/", requireAuth, getCalendar);

