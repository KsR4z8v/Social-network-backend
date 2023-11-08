import sign from "./auth/sign.controller.js";
import signUpController from "./auth/signup.controller.js";
import confirmEmailController from "./auth/confirEmail.controller.js";
import getInfoUserController from "./user/getInfoUser.controller.js";
import dataUpdateController from "./user/data.update.controller.js";
import passwordUpdateController from "./user/password.update.controller.js";
import avatarUpdateController from "./user/avatar.update.controller.js";
import sendEmailVerified from "./auth/sendEmailVerified.controller.js";
import authGooglePlatformController from "./auth/authGooglePlatform.controller.js";
import recoveryPassword from "./user/recovery.password.controller.js";
import deleteAccountController from "./user/deleteAccount.controller.js";
export default {
    sign,
    signUpController,
    confirmEmailController,
    getInfoUserController,
    dataUpdateController,
    passwordUpdateController,
    avatarUpdateController,
    sendEmailVerified,
    authGooglePlatformController,
    recoveryPassword,
    deleteAccountController
}