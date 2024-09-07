/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Router } from "express";
import userRoutes from "../User/infrastructure/user.routes";
import authRoutes from "../Auth/infrastructure/auth.routes";
import postRoutes from "../Posts/infrastructure/post.routes";
import likeRoutes from "../Like/infrastructure/like.routes";
const apiRoutes: Router = Router();

apiRoutes.use("/user", userRoutes);
apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/post", postRoutes);
apiRoutes.use("/like", likeRoutes);

apiRoutes.use((req, res) => {
  res.status(404).json({
    state: "error",
    error: { message: `404, Ups, Resource doesn't found :(` },
  });
});

export default apiRoutes;
