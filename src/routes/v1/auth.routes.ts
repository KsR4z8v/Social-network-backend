import { Router } from "express";
import controllers from "../../controllers";
const {
  signController,
  authGooglePlatformController,
  signUpController,
  logoutController,
  confirmEmailController,
} = controllers;
import {
  middleware_SignUp,
  middleware_Sign,
} from "../../middlewares/userControllers.middlewares";
const auth_routes = Router();

//Authentication
auth_routes.post("/", middleware_Sign, signController.run.bind(signController));
auth_routes.post(
  "/google_platform",
  authGooglePlatformController.run.bind(authGooglePlatformController)
);
auth_routes.post(
  "/signup",
  middleware_SignUp,
  signUpController.run.bind(signUpController)
);
auth_routes.delete("/logout", logoutController.run.bind(logoutController));
auth_routes.post(
  "/confirmEmail/:id_user",
  confirmEmailController.run.bind(confirmEmailController)
);

export default auth_routes;
