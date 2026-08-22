import { z } from "zod";
export const postSchema = z.object({ title: z.string().min(1).max(180), content: z.string().min(1).max(5000), trip: z.string().optional(), activity: z.string().optional(), destination: z.string().max(120).optional(), country: z.string().max(120).optional(), images: z.array(z.string()).optional(), tags: z.array(z.string().max(40)).max(12).optional() });
export const commentSchema = z.object({ content: z.string().min(1).max(1200) });
export const userRoleSchema = z.object({ role: z.enum(["user", "admin"]) });
export const userStatusSchema = z.object({ status: z.enum(["active", "deactivated"]) });
