/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import { middlewareCreatePost } from "../../Posts/infrastructure/middlewares/postControllers.middlewares";
import {
  createPostController,
  obtainPostController,
} from "./controllers/index";

import verifySession from "../../Auth/infrastructure/middlewares/verifySession.middleware";
import multer from "multer";

const upload = multer();
const postRoutes = Router();

// controllers.createPostController
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

export default postRoutes;
