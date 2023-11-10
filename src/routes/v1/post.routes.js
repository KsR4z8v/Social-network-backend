import { Router } from 'express'
import controllers from '../../controllers/index.js'
import verify_token from '../../middlewares/verify_token.middleware.js'
import { middleware_CreatePost } from '../../middlewares/postControllers.middlewares.js'
const post_routes = Router()

// controllers.createPostController
post_routes.post('/createPost', verify_token, middleware_CreatePost, controllers.createPostController)
post_routes.get('/getPosts', verify_token, controllers.getPostsController)



export default post_routes