import { sign } from "jsonwebtoken";
import VerificationCodeExpired from "../../Default/domain/exceptions/VerificationCodeExpired";
import VerificationCodeIncorrect from "../../Default/domain/exceptions/VerificationCodeIncorrect";
import type StoreCacheRepository from "../../Default/domain/StoreCacheRepository";
import type AuthRepository from "../domain/AuthRepository";

export default class ConfirmVerificationCodeCase {
  constructor(
    readonly authRepository: AuthRepository,
    readonly storeCacheRepository: StoreCacheRepository,
  ) {}

  async run(userId: string, code: string): Promise<string> {
    const dataFound = await this.storeCacheRepository.get(userId);

    if (!dataFound) {
      throw new VerificationCodeIncorrect();
    }

    const dataFoundParse = JSON.parse(dataFound);

    if (dataFoundParse.expireTime < new Date().getTime()) {
      throw new VerificationCodeExpired();
    }

    if (code !== dataFoundParse.code) {
      throw new VerificationCodeIncorrect();
    }
    await this.storeCacheRepository.delete(userId);
    await this.authRepository.setVerifyEmail(userId);
    const token: string = sign({ userId }, process.env.SECRET_KEY_TOKEN ?? "");
    return token;
  }
}
