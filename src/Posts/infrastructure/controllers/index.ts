import CreatePostCase from "../../application/CreatePostCase";
import DeletePostCase from "../../application/DeletePostCase";
import ObtainPostCase from "../../application/ObtainPostCase";
import CreatePostController from "./CreatePostController";
import ObtainPostController from "./ObtainPostController";
import DeletePostController from "./DeletePostController";
import ErrorHandler from "../../../Default/helpers/ErrorHandler";
import { postRepository } from "../repositories/index";

const errorHandler: ErrorHandler = new ErrorHandler();

// CASES
const createPostCase: CreatePostCase = new CreatePostCase(postRepository);
const obtainPostCase: ObtainPostCase = new ObtainPostCase(postRepository);
const deletePostCase: DeletePostCase = new DeletePostCase(postRepository);
// CONTROLLERS
export const createPostController: CreatePostController =
  new CreatePostController(createPostCase, errorHandler);

export const obtainPostController: ObtainPostController =
  new ObtainPostController(obtainPostCase, errorHandler);

export const deletePostController: DeletePostController =
  new DeletePostController(deletePostCase, errorHandler);
