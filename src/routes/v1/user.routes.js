import { Router } from "express";
import controllers from '../../controllers/index.js'
const user_routes = Router()

user_routes.post('/sign', controllers.sign)



export default user_routes