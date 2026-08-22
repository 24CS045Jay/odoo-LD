import { z } from "zod";
export const registerSchema = z.object({ firstName: z.string().min(1).max(80), lastName: z.string().min(1).max(80), email: z.string().email(), password: z.string().min(8).max(128), city: z.string().max(100).optional(), country: z.string().max(100).optional() });
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
export const profileSchema = z.object({ firstName: z.string().min(1).max(80).optional(), lastName: z.string().min(1).max(80).optional(), phone: z.string().max(40).optional(), city: z.string().max(100).optional(), country: z.string().max(100).optional(), bio: z.string().max(800).optional(), language: z.string().max(40).optional(), currencyPreference: z.string().max(8).optional(), notificationPreferences: z.object({ email: z.boolean().optional(), product: z.boolean().optional() }).optional() });
export const passwordSchema = z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(8).max(128) });
export const forgotPasswordSchema = z.object({ email: z.string().email() });
export const resetPasswordSchema = z.object({ token: z.string().min(24), password: z.string().min(8).max(128) });
