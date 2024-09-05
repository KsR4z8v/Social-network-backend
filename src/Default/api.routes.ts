/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Router } from "express";
import userRoutes from "../User/infrastructure/user.routes";
import authRoutes from "../Auth/infrastructure/auth.routes";
import postRoutes from "../Posts/infrastructure/post.routes";

const apiRoutes: Router = Router();

apiRoutes.use("/user", userRoutes);
apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/post", postRoutes);

export default apiRoutes;
