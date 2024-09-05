/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from "express";
import multer from "multer";
import {
  createUserController,
  updateUserController,
  deleteUserController,
  obtainUserController,
  sendRequestController,
  deleteRelationController,
  obtainFriendsController,
  obtainRequestsController,
} from "./controllers";

import {
  middlewareSignUp,
  middlewareDataUpdate,
} from "./middlewares/userControllers.middlewares";
import verifySession from "../../Auth/infrastructure/middlewares/verifySession.middleware";

const upload = multer();
const userRoutes = Router();

userRoutes.post(
  "/",
  middlewareSignUp,
  createUserController.run.bind(createUserController),
);

userRoutes.patch(
  "/:userId",
  verifySession,
  upload.single("avatarFile"),
  middlewareDataUpdate,
  updateUserController.run.bind(updateUserController),
);

userRoutes.delete(
  "/:userId",
  verifySession,
  deleteUserController.run.bind(deleteUserController),
);

userRoutes.get(
  "/:user",
  verifySession,
  obtainUserController.run.bind(obtainUserController),
);

userRoutes.post(
  "/:submittedUserId/request/:recipientUserId",
  verifySession,
  sendRequestController.run.bind(sendRequestController),
);

userRoutes.delete(
  "/:userId/relation/:relationId",
  verifySession,
  deleteRelationController.run.bind(deleteRelationController),
);

userRoutes.get(
  "/:user/friends",
  verifySession,
  obtainFriendsController.run.bind(obtainFriendsController),
);

userRoutes.get(
  "/:userId/requests/received",
  verifySession,
  obtainRequestsController.run.bind(obtainRequestsController),
);

/* 



userRoutes.post(
  "/:id_user/password",
  verifyToken,
  middlewarePasswordUpdate,
  passwordUpdateController.run.bind(passwordUpdateController),
);
userRoutes.post(
  "/restore_pass",
  verifyToken,
  restorePasswordController.run.bind(restorePasswordController),
);
 */

export default userRoutes;
