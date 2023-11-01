import { Router } from "express";
import controllers from '../../controllers/index.js'
const user_routes = Router()

user_routes.post('/sign', controllers.sign)
user_routes.patch('/avatar_update', controllers.avatarUpdate)
user_routes.patch('/data_update', controllers.dataUpdate)
user_routes.patch('/password_update/:id_user', controllers.passwordUpdateController)




export default user_routes