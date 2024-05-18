import { Router } from "express";

import postRoutes from "./v1/post.routes";
import authRoutes from "./v1/auth.routes";
import userRoutes from "./v1/user.routes";
import email_routes from "./v1/email.routes";

const routes: Router = Router();
// ROUTES
routes.use("/auth/", authRoutes);
routes.use("/email/", email_routes);
routes.use("/user/", userRoutes);
routes.use("/post/", postRoutes);

export default routes;
