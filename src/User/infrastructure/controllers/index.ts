import ErrorHandler from "../../../Default/helpers/ErrorHandler";
import { userRepository } from "../repositories";
import UpdateUserController from "./UpdateUser.controller";
import DeleteUserController from "./DeleteUser.controller";
import CreateUserController from "./CreateUser.controller";
import SendRequestController from "./SendRequest.controller";
import ObtainUserController from "./ObtainUser.controller";
import DeleteRelationController from "./DeleteRelation.controller";
import ObtainFriendsController from "./ObtainFriends.controller";
import DeleteUserCase from "../../application/DeleteUserCase";
import CreateUserCase from "../../application/CreateUserCase";
import UpdateUserCase from "../../application/UpdateUserCase";
import ObtainUserCase from "../../application/ObtainUserCase";
import SendRequestCase from "../../application/SendRequestCase";
import DeleteRelationCase from "../../application/DeleteRelationCase";
import ObtainFriendsCase from "../../application/ObtainFriendsCase";
import ObtainRequestsCase from "../../application/ObtainRequests";
import ObtainRequestsController from "./ObtainRequests.controller";
import { sendVerifiedEmailCase } from "../../../Auth/infrastructure/controllers";

const errorHandler: ErrorHandler = new ErrorHandler();

// USER CASES
const createUserCase: CreateUserCase = new CreateUserCase(
  userRepository,
  sendVerifiedEmailCase,
);
const updateUserCase: UpdateUserCase = new UpdateUserCase(userRepository);
const deleteUserCase: DeleteUserCase = new DeleteUserCase(userRepository);
const obtainUserCase: ObtainUserCase = new ObtainUserCase(userRepository);
const sendRequestCase: SendRequestCase = new SendRequestCase(userRepository);
const deleteRelationCase: DeleteRelationCase = new DeleteRelationCase(
  userRepository,
);
const obtainFriendsCase: ObtainFriendsCase = new ObtainFriendsCase(
  userRepository,
);
const obtainRequestsCase: ObtainRequestsCase = new ObtainRequestsCase(
  userRepository,
);
// CONTROLLERS

export const createUserController: CreateUserController =
  new CreateUserController(createUserCase, errorHandler);

export const updateUserController = new UpdateUserController(
  updateUserCase,
  errorHandler,
);
export const deleteUserController = new DeleteUserController(
  deleteUserCase,
  errorHandler,
);

export const obtainUserController = new ObtainUserController(
  obtainUserCase,
  errorHandler,
);

export const sendRequestController = new SendRequestController(
  sendRequestCase,
  errorHandler,
);

export const deleteRelationController = new DeleteRelationController(
  deleteRelationCase,
  errorHandler,
);

export const obtainFriendsController = new ObtainFriendsController(
  obtainFriendsCase,
  errorHandler,
);

export const obtainRequestsController = new ObtainRequestsController(
  obtainRequestsCase,
  errorHandler,
);
