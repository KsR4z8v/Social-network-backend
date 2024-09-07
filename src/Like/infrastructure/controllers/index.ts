import SetLikeCase from "../../application/SetLikeCase";
import LikeController from "./setLike.controller";
import { likeRepository } from "../repositories";
import { postRepository } from "../../../Posts/infrastructure/repositories";
import ErrorHandler from "../../../Default/helpers/ErrorHandler";

const errorHandler: ErrorHandler = new ErrorHandler();

// CASES
const setLikeCase: SetLikeCase = new SetLikeCase(
  likeRepository,
  postRepository,
);

// CONTROLLERS

export const likeController: LikeController = new LikeController(
  setLikeCase,
  errorHandler,
);
