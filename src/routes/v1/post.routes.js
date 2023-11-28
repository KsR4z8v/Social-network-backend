import { Router } from 'express'
import controllers from '../../controllers/index.js'
import verify_token from '../../middlewares/verify_token.middleware.js'
import { middleware_CreatePost } from '../../middlewares/postControllers.middlewares.js'
const post_routes = Router()

// controllers.createPostController
post_routes.put('/', verify_token, middleware_CreatePost, controllers.createPostController);
post_routes.delete('/:id_post', verify_token, controllers.logicDeletePostController);
post_routes.get('/', verify_token, controllers.getPostsController);
post_routes.get('/:id_post/likes', verify_token, controllers.getLikesPostController);
post_routes.put('/:id_post/like', verify_token, controllers.likePostController);
post_routes.patch('/:id_post', verify_token, controllers.modifyPostController);

export default post_routes