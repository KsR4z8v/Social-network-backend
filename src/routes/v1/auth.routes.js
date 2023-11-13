import { Router } from "express";
import controllers from "../../controllers/index.js";
import { middleware_sendEmail, middleware_SignUp, middleware_Sign } from "../../middlewares/userControllers.middlewares.js";
const auth_routes = Router()


//Authentication
auth_routes.post('/sign', middleware_Sign, controllers.sign)
auth_routes.post('/signup', middleware_SignUp, controllers.signUpController);
auth_routes.post('/sendEmail', middleware_sendEmail, controllers.sendEmailController)
auth_routes.post('/signup/confirmEmail/:id_user', controllers.confirmEmailController);
auth_routes.post('/sign_google_platform', controllers.authGooglePlatformController)


export default auth_routes