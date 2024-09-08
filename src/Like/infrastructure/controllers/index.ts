import ObtainLikesController from "./ObtainLikes.controller";
import CreateLikeController from "./CreateLike.controller";
import SetLikeCase from "../../application/SetLikeCase";
import ObtainLikesCase from "../../application/ObtainLikesCase";
import { likeRepository } from "../repositories";
import { postRepository } from "../../../Posts/infrastructure/repositories";
import ErrorHandler from "../../../Default/helpers/ErrorHandler";

const errorHandler: ErrorHandler = new ErrorHandler();

// CASES
const setLikeCase: SetLikeCase = new SetLikeCase(
  likeRepository,
  postRepository,
);
const obtainLikesCase: ObtainLikesCase = new ObtainLikesCase(likeRepository);

// CONTROLLERS

export const likeController: CreateLikeController = new CreateLikeController(
  setLikeCase,
  errorHandler,
);

export const obtainLikesController: ObtainLikesController =
  new ObtainLikesController(obtainLikesCase, errorHandler);
