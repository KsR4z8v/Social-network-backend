import { Router } from "express";

import post_routes from "./v1/post.routes";
import auth_routes from "./v1/auth.routes";
import user_routes from "./v1/user.routes";
import email_routes from "./v1/email.routes";

const routes: Router = Router();
//ROUTES
routes.use("/auth/", auth_routes);
routes.use("/email/", email_routes);
routes.use("/user/", user_routes);
routes.use("/post/", post_routes);

export default routes;
