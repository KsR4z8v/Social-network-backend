import generateVerificationCode from "../helpers/generateVerificationCode";
import type StoreCacheRepository from "../domain/StoreCacheRepository";
import type EmailService from "../domain/EmailService";
import { verificationCode } from "../helpers/EmailEnums";

export default class SendVerifiedEmailCase {
  constructor(
    readonly emailService: EmailService,
    readonly storeCacheRepository: StoreCacheRepository,
  ) {}

  async run(userId: string, username: string, email: string): Promise<void> {
    const verifyCode: string = generateVerificationCode(4);

    await this.storeCacheRepository.set(
      userId,
      JSON.stringify({
        code: verifyCode,
        expireTime: new Date().getTime() + 120000, // 2 min
      }),
    );

    void this.emailService.sendEmail(
      email,
      "Codigo de verificacion",
      verificationCode(username, verifyCode),
    );
  }
}
