import repositories from "../database/repositories";
const { userRepository, postRepository } = repositories;
import ErrorHandler from "../helpers/ErrorHandler";
const errorHandler: ErrorHandler = new ErrorHandler();

//AUTH CONTROLLERS
import SignController from "./auth/sign.controller";
import SignUpController from "./auth/signup.controller";
import LogoutController from "./auth/logout.controller";
import SendEmailController from "./email/sendEmail.controller";
import AuthGooglePlatformController from "./auth/authGooglePlatform.controller";
import ConfirmEmailController from "./auth/ConfirmEmailController";

//USER CONTROLLERS
import GetInfoUserController from "./user/getInfoUser.controller";
import DataUpdateController from "./user/dataUpdate.controller";
import PasswordUpdateController from "./user/passwordUpdate.controller";
import AvatarUpdateController from "./user/avatar.update.controller";
import RestorePasswordController from "./user/restorePassword.controller";
import DeleteAccountController from "./user/deleteAccount.controller";
import DeleteRelationController from "./user/relationships/deleteRelation.controller";
import FriendRequestController from "./user/relationships/friendRequest.controller";

//POST CONTROLLERS
import CreatePostController from "./posts/createPost.controller";
import GetPostsController from "./posts/getPosts.controller";
import LikePostController from "./posts/like.controller";

//COMMENTS CONTROLLERS
import CreateCommentController from "./comments/createComment.controller";
import GetCommentsController from "./comments/getComments.controller";
import GetLikesPostController from "./posts/getLikesPost.controller";
import DeletePostController from "./posts/deletePost.controller";

export default {
  signController: new SignController(userRepository, errorHandler),
  signUpController: new SignUpController(userRepository, errorHandler),
  authGooglePlatformController: new AuthGooglePlatformController(
    userRepository,
    errorHandler
  ),
  logoutController: new LogoutController(errorHandler),
  sendEmailController: new SendEmailController(userRepository, errorHandler),
  confirmEmailController: new ConfirmEmailController(
    userRepository,
    errorHandler
  ),
  getInfoUserController: new GetInfoUserController(
    userRepository,
    errorHandler
  ),
  dataUpdateController: new DataUpdateController(userRepository, errorHandler),
  passwordUpdateController: new PasswordUpdateController(
    userRepository,
    errorHandler
  ),
  avatarUpdateController: new AvatarUpdateController(
    userRepository,
    errorHandler
  ),
  restorePasswordController: new RestorePasswordController(
    userRepository,
    errorHandler
  ),
  deleteAccountController: new DeleteAccountController(
    userRepository,
    errorHandler
  ),
  deleteRelationController: new DeleteRelationController(
    userRepository,
    errorHandler
  ),
  friendRequestController: new FriendRequestController(
    userRepository,
    errorHandler
  ),
  createPostController: new CreatePostController(
    postRepository,
    userRepository,
    errorHandler
  ),
  getPostsController: new GetPostsController(postRepository, errorHandler),
  likePostController: new LikePostController(postRepository, errorHandler),

  createCommentController: new CreateCommentController(
    postRepository,
    userRepository,
    errorHandler
  ),
  getCommentsController: new GetCommentsController(
    postRepository,
    errorHandler
  ),
  getLikesPostController: new GetLikesPostController(
    postRepository,
    errorHandler
  ),
  deletePostController: new DeletePostController(postRepository, errorHandler),
  /*editComment,
  deleteComment,
  modifyPostController,
  getLikesPostController,
  reportPostController, */
};
