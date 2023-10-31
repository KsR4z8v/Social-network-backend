import { Router } from "express";
import controllers from '../../controllers/index.js'
const user_routes = Router()

user_routes.post('/sign', controllers.sign)
user_routes.post('/signup', controllers.signUpController);
user_routes.post('/signup/confirmEmail/:id_usuario', controllers.confirmEmailController);


export default user_routes