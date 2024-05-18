/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import controllers from "../../controllers";
import {
  middlewareSignUp,
  middlewareSign,
} from "../../middlewares/userControllers.middlewares";
const {
  signController,
  authGooglePlatformController,
  signUpController,
  logoutController,
  confirmEmailController,
} = controllers;
const authRoutes = Router();

// Authentication
authRoutes.post("/", middlewareSign, signController.run.bind(signController));
authRoutes.post(
  "/google_platform",
  authGooglePlatformController.run.bind(authGooglePlatformController),
);
authRoutes.post(
  "/signup",
  middlewareSignUp,
  signUpController.run.bind(signUpController),
);
authRoutes.delete("/logout", logoutController.run.bind(logoutController));
authRoutes.post(
  "/confirmEmail/:id_user",
  confirmEmailController.run.bind(confirmEmailController),
);

export default authRoutes;
