import { Router } from 'express'
import controllers from '../../controllers/index.js'
import verify_token from '../../middlewares/verify_token.middleware.js'

const post_routes = Router()

post_routes.get('/id:post', verify_token , controllers.getComments)
post_routes.post('/createComment/:id_post', verify_token, controllers.createComment);
post_routes.put('/editComment/:id_comment', verify_token, controllers.editComment);
post_routes.put('/deleteComment/:id_comment', verify_token, controllers.deleteComment);





export default post_routes