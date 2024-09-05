/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type AuthRepository from "../domain/AuthRepository";
import { hashString } from "../../Default/helpers/hashString";
import { JwtPayload, verify } from "jsonwebtoken";

export default class RestorePasswordCase {
  constructor(readonly authRepository: AuthRepository) {}

  async run(token: string, newPassword: string): Promise<void> {
    const data = verify(
      token,
      process.env.SECRET_RESTORE_PASSWORD ?? ""
    ) as JwtPayload;

    const userId: string = data.userId;

    const hashPassword: string = await hashString(newPassword);

    await this.authRepository.updatePassword(userId, hashPassword);
  }
}
