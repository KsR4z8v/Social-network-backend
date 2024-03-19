import { Router } from "express";
import controllers from "../../controllers";
import { middleware_sendEmail } from "../../middlewares/userControllers.middlewares";
const email_routes: Router = Router();

email_routes.post(
  "/sendEmail",
  middleware_sendEmail,
  controllers.sendEmailController.run.bind(controllers.sendEmailController)
);

export default email_routes;
