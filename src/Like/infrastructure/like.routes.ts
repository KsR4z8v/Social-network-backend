import { Router } from "express";
import { likeController, obtainLikesController } from "./controllers";
import verifySession from "../../Auth/infrastructure/middlewares/verifySession.middleware";
import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 1000,
  limit: 1,
  message: "fuck you",
});

const likeRoutes = Router();

likeRoutes.post(
  "/:to/:type",
  limiter,
  verifySession,
  likeController.run.bind(likeController),
);

likeRoutes.get(
  "/:from",
  verifySession,
  obtainLikesController.run.bind(obtainLikesController),
);

export default likeRoutes;
