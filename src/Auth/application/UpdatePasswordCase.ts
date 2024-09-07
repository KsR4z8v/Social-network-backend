/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type AuthRepository from "../domain/AuthRepository";
import { hashString } from "../../Default/helpers/hashString";
import type UserAuthenticatorCase from "./UserAuthenticatorCase";
import IncorrectDataRequest from "../../Default/domain/exceptions/IncorrectDataRequest";

export default class UpdatePasswordCase {
  constructor(
    readonly authRepository: AuthRepository,
    readonly userAuthenticatorCase: UserAuthenticatorCase,
  ) {}

  async run(
    user: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    if (oldPassword === newPassword) {
      throw new IncorrectDataRequest("Las contraseñas son iguales");
    }
    const authResponse = await this.userAuthenticatorCase.run(
      user,
      oldPassword,
    );

    const hashPassword: string = await hashString(newPassword);
    await this.authRepository.updatePassword(authResponse.userId, hashPassword);
  }
}
