import { Router } from "express";
import * as controller from "../controllers/community.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { commentSchema, postSchema } from "../validators/community.validator";
export const communityRouter = Router();
communityRouter.get("/", controller.listPosts); communityRouter.get("/:id", controller.getPost); communityRouter.get("/:id/comments", controller.listComments); communityRouter.post("/", requireAuth, validate(postSchema), controller.createPost); communityRouter.put("/:id", requireAuth, validate(postSchema), controller.updatePost); communityRouter.delete("/:id", requireAuth, controller.deletePost); communityRouter.post("/:id/like", requireAuth, controller.likePost); communityRouter.delete("/:id/like", requireAuth, controller.likePost); communityRouter.post("/:id/comments", requireAuth, validate(commentSchema), controller.createComment);
export const commentRouter = Router(); commentRouter.put("/:id", requireAuth, validate(commentSchema), controller.updateComment); commentRouter.delete("/:id", requireAuth, controller.deleteComment);
