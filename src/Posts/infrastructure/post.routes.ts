/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import { middlewareCreatePost } from "../../Posts/infrastructure/middlewares/postControllers.middlewares";
import verifySession from "../../Auth/infrastructure/middlewares/verifySession.middleware";

import {
  createPostController,
  obtainPostController,
  deletePostController,
} from "./controllers/index";
import multer from "multer";

const upload = multer();
const postRoutes = Router();

postRoutes.post(
  "/",
  verifySession,
  upload.array("media"),
  middlewareCreatePost,
  createPostController.run.bind(createPostController),
);

postRoutes.get(
  "/",
  verifySession,
  obtainPostController.run.bind(obtainPostController),
);

postRoutes.delete(
  "/:postId",
  verifySession,
  deletePostController.run.bind(deletePostController),
);

export default postRoutes;
