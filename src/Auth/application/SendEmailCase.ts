import type SendResetPasswordEmailCase from "./SendResetPasswordEmailCase";
import type SendVerifiedEmailCase from "../../Default/application/SendVerifiedEmailCase";
import type AuthRepository from "../domain/AuthRepository";

export default class SendEmailCase {
  constructor(
    readonly authRepository: AuthRepository,
    readonly sendVerifiedEmailCase: SendVerifiedEmailCase,
    readonly sendResetPasswordEmailCase: SendResetPasswordEmailCase
  ) {}
  async run(user: string, type: string): Promise<void> {
    const userCredentialsFound = await this.authRepository.findUserCredentials(
      user
    );

    if (
      userCredentialsFound &&
      !userCredentialsFound.emailVerified &&
      type === "verification"
    ) {
      await this.sendVerifiedEmailCase.run(
        userCredentialsFound.userId,
        userCredentialsFound.username,
        userCredentialsFound.email
      );
    }

    if (userCredentialsFound && type === "passReset") {
      await this.sendResetPasswordEmailCase.run(
        userCredentialsFound.userId,
        userCredentialsFound.username,
        userCredentialsFound.email
      );
    }
  }
}
