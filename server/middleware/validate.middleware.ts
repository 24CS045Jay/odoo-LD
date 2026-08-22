import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { ApiError } from "../utils/apiResponse";

export function validate(schema: ZodType, source: "body" | "query" | "params" = "body"): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) return next(new ApiError(422, "Validation failed", result.error.flatten()));
    (req as any)[source] = result.data;
    next();
  };
}
