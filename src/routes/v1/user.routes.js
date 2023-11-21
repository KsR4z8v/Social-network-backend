import { Router } from "express";
import controllers from '../../controllers/index.js'
import { middleware_DataUpdate, middleware_avatarUpdate, middleware_passwordUpdate } from "../../middlewares/userControllers.middlewares.js";
import verify_token from "../../middlewares/verify_token.middleware.js";
const user_routes = Router()

//User
user_routes.post('/getInfo', verify_token, controllers.getInfoUserController)
user_routes.patch('/avatar_update', verify_token, middleware_avatarUpdate, controllers.avatarUpdateController)
user_routes.patch('/data_update', verify_token, middleware_DataUpdate, controllers.dataUpdateController)
user_routes.post('/password_update', verify_token, middleware_passwordUpdate, controllers.passwordUpdateController)
user_routes.post('/restore_password', verify_token, controllers.restorePasswordController)
user_routes.delete('/deleteAccount', verify_token, controllers.deleteAccountController);
user_routes.post('/SendFriendReq/:to_user', verify_token, controllers.friendRequestController);

export default user_routes