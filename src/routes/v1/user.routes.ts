/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from "express";
import controllers from "../../controllers";

import {
  middlewareDataUpdate,
  middlewareAvatarUpdate,
  middlewarePasswordUpdate,
} from "../../middlewares/userControllers.middlewares";

import verifyToken from "../../middlewares/verifyToken.middleware";

import multer from "multer";
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

const upload = multer();
const userRoutes = Router();

// User
userRoutes.get(
  "/:user",
  verifyToken,
  getInfoUserController.run.bind(getInfoUserController),
);
userRoutes.get(
  "/:user/friends",
  verifyToken,
  getFriendsController.run.bind(getFriendsController),
);
userRoutes.get(
  "/:user/:type",
  verifyToken,
  getRequestsController.run.bind(getRequestsController),
);
userRoutes.patch(
  "/:id_user/avatar",
  verifyToken,
  upload.single("avatar"),
  middlewareAvatarUpdate,
  avatarUpdateController.run.bind(avatarUpdateController),
);
userRoutes.patch(
  "/:id_user",
  verifyToken,
  middlewareDataUpdate,
  dataUpdateController.run.bind(dataUpdateController),
);
userRoutes.post(
  "/:id_user/password",
  verifyToken,
  middlewarePasswordUpdate,
  passwordUpdateController.run.bind(passwordUpdateController),
);
userRoutes.post(
  "/:id_user/restore_pass",
  verifyToken,
  restorePasswordController.run.bind(restorePasswordController),
);
userRoutes.delete(
  "/:id_user",
  verifyToken,
  deleteAccountController.run.bind(deleteAccountController),
);
userRoutes.post(
  "/:id_user/sendRequest/:to_user",
  verifyToken,
  friendRequestController.run.bind(friendRequestController),
);
userRoutes.delete(
  "/:id_user/relation/:id_relation",
  verifyToken,
  deleteRelationController.run.bind(deleteRelationController),
);

export default userRoutes;
