/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import { middlewareSign } from "../../User/infrastructure/middlewares/userControllers.middlewares";
import {
  authController,
  logoutController,
  updatePasswordController,
  confirmVerificationCodeController,
  sendEmailController,
  restorePasswordController,
} from "./controllers";
const authRoutes = Router();

authRoutes.post("/", middlewareSign, authController.run.bind(authController));
authRoutes.delete("/logout", logoutController.run.bind(logoutController));
authRoutes.patch(
  "/:userId/password",
  updatePasswordController.run.bind(updatePasswordController)
);
authRoutes.post(
  "/:userId/code/confirm",
  confirmVerificationCodeController.run.bind(confirmVerificationCodeController)
);

authRoutes.post(
  "/:user/email/:type",
  sendEmailController.run.bind(sendEmailController)
);

authRoutes.post(
  "/:token/restore/password",
  restorePasswordController.run.bind(restorePasswordController)
);
export default authRoutes;
