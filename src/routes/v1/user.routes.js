import { Router } from "express";
import controllers from '../../controllers/index.js'
import { middleware_Sign, middleware_SignUp } from "../../middlewares/userControllers.middlewares.js";
const user_routes = Router()

user_routes.post('/sign', middleware_Sign, controllers.sign)
user_routes.post('/signup', middleware_SignUp, controllers.signUpController);
user_routes.post('/signup/confirmEmail/:id_usuario', controllers.confirmEmailController);


export default user_routes