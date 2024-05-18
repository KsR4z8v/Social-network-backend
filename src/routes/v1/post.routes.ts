/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import controllers from "../../controllers";
import verify_token from "../../middlewares/verifyToken.middleware";
import { middlewareCreatePost } from "../../middlewares/postControllers.middlewares";
import multer from "multer";
const {
  createPostController,
  getPostsController,
  likePostController,
  createCommentController,
  getCommentsController,
  getLikesPostController,
  deletePostController,
} = controllers;

const upload = multer();
const postRoutes = Router();

// controllers.createPostController
postRoutes.put(
  "/:id_user",
  verify_token,
  upload.array("media"),
  middlewareCreatePost,
  createPostController.run.bind(createPostController),
);
postRoutes.get(
  "/",
  verify_token,
  getPostsController.run.bind(getPostsController),
);

postRoutes.put(
  "/:id_post/likeby/:id_user",
  verify_token,
  likePostController.run.bind(likePostController),
);

postRoutes.put(
  "/:id_post/commentby/:id_user",
  verify_token,
  createCommentController.run.bind(createCommentController),
);

postRoutes.get(
  "/:id_post/comments",
  verify_token,
  getCommentsController.run.bind(getCommentsController),
);
postRoutes.get(
  "/:id_post/likes",
  verify_token,
  getLikesPostController.run.bind(getLikesPostController),
);
postRoutes.delete(
  "/:id_post",
  verify_token,
  deletePostController.run.bind(deletePostController),
);
/* post_routes.put(
  "/:id_post/report",
  verify_token,
  controllers.reportPostController
);

post_routes.patch("/:id_post", verify_token, controllers.modifyPostController); */

export default postRoutes;
