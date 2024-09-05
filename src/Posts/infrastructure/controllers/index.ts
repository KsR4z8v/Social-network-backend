import CreatePostCase from "../../application/CreatePostCase";
import CreatePostController from "./CreatePostController";
import ObtainPostController from "./ObtainPostController";
import ErrorHandler from "../../../Default/helpers/ErrorHandler";
import { postRepository } from "../repositories/index";
import ObtainPostCase from "../../application/ObtainPostCase";

const errorHandler: ErrorHandler = new ErrorHandler();

// CASES
const createPostCase: CreatePostCase = new CreatePostCase(postRepository);
const obtainPostCase: ObtainPostCase = new ObtainPostCase(postRepository);

// CONTROLLERS
export const createPostController: CreatePostController =
  new CreatePostController(createPostCase, errorHandler);

export const obtainPostController: ObtainPostController =
  new ObtainPostController(obtainPostCase, errorHandler);
