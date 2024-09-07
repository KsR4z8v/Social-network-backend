import generateVerificationCode from "../../Default/helpers/generateVerificationCode";
import type StoreCacheRepository from "../../Default/domain/StoreCacheRepository";
import type EmailService from "../../Default/domain/EmailService";
import {
  resetPassword,
  verificationCode,
} from "../../Default/helpers/EmailEnums";
import { sign } from "jsonwebtoken";

export default class SendResetPasswordEmailCase {
  constructor(readonly emailService: EmailService) {}

  async run(userId: string, username: string, email: string): Promise<void> {
    const redirectToLink = process.env.SECURE_URL_RESET_PASSWORD;
    const secretKey = process.env.SECRET_RESTORE_PASSWORD;

    if (!redirectToLink) {
      throw new Error("SECURE_URL_RESET_PASSWORD missing");
    }
    if (!secretKey) {
      throw new Error("SECRET_RESTORE_PASSWORD missing");
    }
    const token: string = sign(
      { userId, message: "Nada se le perdio por aca ;)" },
      secretKey,
      { expiresIn: 120 }
    );
    void this.emailService.sendEmail(
      email,
      "Restaurar contraseña",
      resetPassword(username, token, redirectToLink)
    );
  }
}
