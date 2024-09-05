import ErrorHandler from "../../../Default/helpers/ErrorHandler";
import LogoutController from "./Logout.controller";
import AuthController from "./Auth.controller";
import SendEmailController from "./SendEmail.controller";
import ConfirmVerificationCodeController from "./ConfirmVerificationCode.controller";
import UpdatePasswordController from "./UpdatePassword.controller";
import UserAuthenticatorCase from "../../application/UserAuthenticatorCase";
import UpdatePasswordCase from "../../application/UpdatePasswordCase";
import SendVerifiedEmailCase from "../../../Default/application/SendVerifiedEmailCase";
import ConfirmVerificationCodeCase from "../../application/ConfirmVerificationCodeCase";
import SendEmailCase from "../../application/SendEmailCase";
import { authRepository } from "../repositories";
import { storeCacheRepository } from "../../../Default/infrastructure/repositories";
import { emailService } from "../../../Default/infrastructure/services";
import SendResetPasswordEmailCase from "../../application/SendResetPasswordEmailCase";
import RestorePasswordController from "./RestorePassword.controller";
import RestorePasswordCase from "../../application/RestorePasswordCase";
const errorHandler = new ErrorHandler();

// CASES
const userAuthenticatorCase: UserAuthenticatorCase = new UserAuthenticatorCase(
  authRepository
);
const updatePasswordCase: UpdatePasswordCase = new UpdatePasswordCase(
  authRepository,
  userAuthenticatorCase
);
export const sendVerifiedEmailCase: SendVerifiedEmailCase =
  new SendVerifiedEmailCase(emailService, storeCacheRepository);

export const sendResetPasswordEmailCase: SendResetPasswordEmailCase =
  new SendResetPasswordEmailCase(emailService);

const confirmVerificationCodeCase: ConfirmVerificationCodeCase =
  new ConfirmVerificationCodeCase(authRepository, storeCacheRepository);

const sendEmailCase: SendEmailCase = new SendEmailCase(
  authRepository,
  sendVerifiedEmailCase,
  sendResetPasswordEmailCase
);

const restorePasswordCase: RestorePasswordCase = new RestorePasswordCase(
  authRepository
);

// CONTROLLERS
export const logoutController: LogoutController = new LogoutController(
  errorHandler
);

export const authController: AuthController = new AuthController(
  userAuthenticatorCase,
  sendVerifiedEmailCase,
  errorHandler
);

export const updatePasswordController: UpdatePasswordController =
  new UpdatePasswordController(updatePasswordCase, errorHandler);

export const restorePasswordController: RestorePasswordController =
  new RestorePasswordController(restorePasswordCase, errorHandler);

export const confirmVerificationCodeController: ConfirmVerificationCodeController =
  new ConfirmVerificationCodeController(
    confirmVerificationCodeCase,
    errorHandler
  );

export const sendEmailController: SendEmailController = new SendEmailController(
  sendEmailCase,
  errorHandler
);
