/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import controllers from "../../controllers";
import { middlewareSendEmail } from "../../middlewares/userControllers.middlewares";
const emailRoutes: Router = Router();

emailRoutes.post(
  "/sendEmail",
  middlewareSendEmail,
  controllers.sendEmailController.run.bind(controllers.sendEmailController),
);

export default emailRoutes;
