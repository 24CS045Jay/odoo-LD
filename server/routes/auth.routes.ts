import { Router } from "express";
import { demoLogin, forgotPassword, login, logout, me, register, resetPassword } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { authRateLimit } from "../middleware/rateLimiter.middleware";
import { validate } from "../middleware/validate.middleware";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from "../validators/auth.validator";
export const authRouter = Router();
authRouter.post("/register", authRateLimit, validate(registerSchema), register); authRouter.post("/login", authRateLimit, validate(loginSchema), login); authRouter.post("/demo-login", authRateLimit, demoLogin); authRouter.get("/me", requireAuth, me); authRouter.post("/logout", requireAuth, logout); authRouter.post("/forgot-password", authRateLimit, validate(forgotPasswordSchema), forgotPassword); authRouter.post("/reset-password", authRateLimit, validate(resetPasswordSchema), resetPassword);
