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
import sendEmailController from "./auth/sendEmail.controller.js";
export default {
    sign,
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
    sendEmailController
}