import { Router } from "express";
import controllers from "../../controllers";
import verify_token from "../../middlewares/verify_token.middleware";
import { middleware_CreatePost } from "../../middlewares/postControllers.middlewares";
const {
  createPostController,
  getPostsController,
  likePostController,
  createCommentController,
  getCommentsController,
  getLikesPostController,
  deletePostController,
} = controllers;
import multer from "multer";
const upload = multer();
const post_routes = Router();

// controllers.createPostController
post_routes.put(
  "/:id_user",
  verify_token,
  upload.array("media"),
  middleware_CreatePost,
  createPostController.run.bind(createPostController)
);
post_routes.get(
  "/",
  verify_token,
  getPostsController.run.bind(getPostsController)
);

post_routes.put(
  "/:id_post/likeby/:id_user",
  verify_token,
  likePostController.run.bind(likePostController)
);

post_routes.put(
  "/:id_post/commentby/:id_user",
  verify_token,
  createCommentController.run.bind(createCommentController)
);

post_routes.get(
  "/:id_post/comments",
  verify_token,
  getCommentsController.run.bind(getCommentsController)
);
post_routes.get(
  "/:id_post/likes",
  verify_token,
  getLikesPostController.run.bind(getLikesPostController)
);
post_routes.delete(
  "/:id_post",
  verify_token,
  deletePostController.run.bind(deletePostController)
);
/* post_routes.put(
  "/:id_post/report",
  verify_token,
  controllers.reportPostController
);

post_routes.patch("/:id_post", verify_token, controllers.modifyPostController); */

export default post_routes;
