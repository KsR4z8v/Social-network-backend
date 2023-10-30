import { Router } from "express";
import controllers from '../../controllers/index.js'
const user_routes = Router()

user_routes.post('/sign', controllers.sign)
user_routes.patch('/avatar_update', controllers.avatarUpdate)



export default user_routes