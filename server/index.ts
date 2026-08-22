import "express-async-errors";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { createServer } from "http";
import morgan from "morgan";
import { connectMongo } from "./config/db";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler.middleware";
import { notFound } from "./middleware/notFound.middleware";
import { activityRouter } from "./routes/activity.routes";
import { adminRouter } from "./routes/admin.routes";
import { authRouter } from "./routes/auth.routes";
import { calendarRouter } from "./routes/calendar.routes";
import { cityRouter } from "./routes/city.routes";
import { commentRouter, communityRouter } from "./routes/community.routes";
import { shareRouter } from "./routes/share.routes";
import { tripRouter } from "./routes/trip.routes";
import { userRouter } from "./routes/user.routes";
import { registerStorageProxy } from "./_core/storageProxy";
import { serveStatic, setupVite } from "./_core/vite";

async function startServer() {
  await connectMongo();
  const app = express();
  const server = createServer(app);
  app.disable("x-powered-by");
  app.use(helmet({ contentSecurityPolicy: env.NODE_ENV === "production" ? undefined : false }));
  app.use(cors({ origin: env.CLIENT_URL, credentials: false }));
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true, limit: "2mb" }));
  registerStorageProxy(app);
  app.get("/api/health", (_req, res) => res.json({ success: true, data: { service: "world-trotter-api", status: "ready" }, message: "API healthy" }));
  app.use("/api/auth", authRouter); app.use("/api/users", userRouter); app.use("/api/trips", tripRouter); app.use("/api/cities", cityRouter); app.use("/api/activities", activityRouter); app.use("/api/calendar", calendarRouter); app.use("/api/community", communityRouter); app.use("/api/comments", commentRouter); app.use("/api/public", shareRouter); app.use("/api/admin", adminRouter);
  app.use("/api", notFound);
  if (env.NODE_ENV === "development") await setupVite(app, server); else serveStatic(app);
  app.use(errorHandler);
  server.listen(env.PORT, () => console.log(`World Trotter server listening on http://localhost:${env.PORT}`));
}

startServer().catch(error => { console.error("Unable to start World Trotter server", error); process.exit(1); });
