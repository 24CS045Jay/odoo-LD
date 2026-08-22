import { Router } from "express";
import { createCity, deleteCity, getCity, listCities, updateCity } from "../controllers/catalog.controller";
import { requireAdmin } from "../middleware/admin.middleware";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { citySchema } from "../validators/catalog.validator";
export const cityRouter = Router(); cityRouter.get("/", listCities); cityRouter.get("/:id", getCity); cityRouter.post("/", requireAuth, requireAdmin, validate(citySchema), createCity); cityRouter.put("/:id", requireAuth, requireAdmin, validate(citySchema), updateCity); cityRouter.delete("/:id", requireAuth, requireAdmin, deleteCity);
