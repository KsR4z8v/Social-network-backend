import { Router } from "express";
import controllers from "../../controllers";
const {
  getInfoUserController,
  avatarUpdateController,
  dataUpdateController,
  passwordUpdateController,
  restorePasswordController,
  deleteAccountController,
  friendRequestController,
  deleteRelationController,
  getFriendsController,
  getRequestsController,
} = controllers;
import {
  middleware_DataUpdate,
  middleware_avatarUpdate,
  middleware_passwordUpdate,
} from "../../middlewares/userControllers.middlewares";
import verify_token from "../../middlewares/verify_token.middleware";
import multer from "multer";
const upload = multer();
const user_routes = Router();

//User
user_routes.get(
  "/:user",
  verify_token,
  getInfoUserController.run.bind(getInfoUserController)
);
user_routes.get(
  "/:user/friends",
  verify_token,
  getFriendsController.run.bind(getFriendsController)
);
user_routes.get(
  "/:user/:type",
  verify_token,
  getRequestsController.run.bind(getRequestsController)
);
user_routes.patch(
  "/:id_user/avatar",
  verify_token,
  upload.single("avatar"),
  middleware_avatarUpdate,
  avatarUpdateController.run.bind(avatarUpdateController)
);
user_routes.patch(
  "/:id_user",
  verify_token,
  middleware_DataUpdate,
  dataUpdateController.run.bind(dataUpdateController)
);
user_routes.post(
  "/:id_user/password",
  verify_token,
  middleware_passwordUpdate,
  passwordUpdateController.run.bind(passwordUpdateController)
);
user_routes.post(
  "/:id_user/restore_pass",
  verify_token,
  restorePasswordController.run.bind(restorePasswordController)
);
user_routes.delete(
  "/:id_user",
  verify_token,
  deleteAccountController.run.bind(deleteAccountController)
);
user_routes.post(
  "/:id_user/sendRequest/:to_user",
  verify_token,
  friendRequestController.run.bind(friendRequestController)
);
user_routes.delete(
  "/:id_user/relation/:id_relation",
  verify_token,
  deleteRelationController.run.bind(deleteRelationController)
);

export default user_routes;
