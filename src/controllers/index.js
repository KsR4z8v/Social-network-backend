import sign from "./auth/sign.controller.js";
import signUpController from "./auth/signup.controller.js";
import confirmEmailController from "./auth/confirEmail.controller.js";
import getInfoUserController from "./user/getInfoUser.controller.js";
import dataUpdateController from "./user/data.update.controller.js";
import passwordUpdateController from "./user/password.update.controller.js";
import avatarUpdateController from "./user/avatar.update.controller.js";
import authGooglePlatformController from "./auth/authGooglePlatform.controller.js";
import restorePasswordController from "./user/restore_password.controller.js";
import deleteAccountController from "./user/deleteAccount.controller.js";
import createPostController from "./posts/createPost.controller.js";
import getPostsController from "./posts/getPosts.controller.js";
import likePostController from "./posts/like.controller.js";
import logicDeletePostController from "./posts/logicDeletePost.controller.js";
import sendEmailController from "./auth/sendEmail.controller.js";
import createComment from "./comments/createcomment.controller.js";
import editComment from "./comments/editComment.controller.js";
import deleteComment from "./comments/deleteComment.controller.js";
import getComments from "./comments/getComments.controller.js";
import modifyPostController from "./posts/modifyPost.controller.js";
import friendRequestController from "./user/relationships/friendRequest.controller.js";
import deleteRelationController from "./user/relationships/deleteRelation.controller.js"
import logoutController from "./auth/logout.controller.js";
import getLikesPostController from "./posts/getLikesPost.controller.js";
import reportPostController from "./posts/reportPost.controller.js";
export default {
    sign,
    logoutController,
    signUpController,
    confirmEmailController,
    getInfoUserController,
    dataUpdateController,
    passwordUpdateController,
    avatarUpdateController,
    authGooglePlatformController,
    restorePasswordController,
    deleteAccountController,
    createPostController,
    getPostsController,
    likePostController,
    sendEmailController,
    createComment,
    editComment,
    deleteComment,
    getComments,
    modifyPostController,
    friendRequestController,
    deleteRelationController,
    getLikesPostController,
    reportPostController,
    logicDeletePostController
}