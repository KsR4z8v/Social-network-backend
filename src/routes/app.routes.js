import { Router } from "express";
import user_routes from "./v1/user.routes.js";
import post_routes from "./v1/post.routes.js";

const routes = Router()
const app_routes = Router()



//ROUTES 
routes.use('/user/', user_routes)
routes.use('/post/', post_routes)





app_routes.use('/api/v1/', routes)
export default app_routes

