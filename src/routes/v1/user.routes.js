import { Router } from "express";
import controllers from '../../controllers/index.js'
import { middleware_Sign, middleware_SignUp, middleware_DataUpdate } from "../../middlewares/userControllers.middlewares.js";
const user_routes = Router()

user_routes.post('/sign', middleware_Sign, controllers.sign)
user_routes.post('/signup', middleware_SignUp, controllers.signUpController);
user_routes.post('/signup/confirmEmail/:id_usuario', controllers.confirmEmailController);
user_routes.post('/getInfo/:id_user', controllers.getInfoUserController)
user_routes.patch('/avatar_update', controllers.avatarUpdateController)
user_routes.patch('/data_update', middleware_DataUpdate, controllers.dataUpdateController)
user_routes.patch('/password_update/:id_user', controllers.passwordUpdateController)
user_routes.post('/sendEmail_verified', controllers.sendEmailVerified)

export default user_routes