import { Router } from "express";
import controllers from '../../controllers/index.js'
import { middleware_Sign, middleware_SignUp, middleware_DataUpdate, middleware_avatarUpdate, middleware_passwordUpdate } from "../../middlewares/userControllers.middlewares.js";
import verify_token from "../../middlewares/verify_token.middleware.js";
const user_routes = Router()

user_routes.post('/sign', middleware_Sign, controllers.sign)
user_routes.post('/signup', middleware_SignUp, controllers.signUpController);
user_routes.post('/signup/confirmEmail/:id_usuario', controllers.confirmEmailController);
user_routes.post('/getInfo', verify_token, controllers.getInfoUserController)
user_routes.patch('/avatar_update', verify_token, middleware_avatarUpdate, controllers.avatarUpdateController)
user_routes.patch('/data_update', verify_token, middleware_DataUpdate, controllers.dataUpdateController)
user_routes.post('/password_update', verify_token, middleware_passwordUpdate, controllers.passwordUpdateController)
user_routes.post('/sendEmail_verified', controllers.sendEmailVerified)
user_routes.post('/sign_google_platform', controllers.authGooglePlatformController)
user_routes.delete('/deleteAccount' , verify_token,);
user_routes.post('/recovery_password', controllers.recoveryPassword)

export default user_routes