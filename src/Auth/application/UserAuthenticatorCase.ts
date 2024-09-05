/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { sign } from "jsonwebtoken";
import AccountDeactivated from "../../Default/domain/exceptions/AccountDeactivated";
import PasswordIncorrect from "../../Default/domain/exceptions/PasswordIncorrect";
import type AuthRepository from "../domain/AuthRepository";
import { compare } from "bcryptjs";
import UserNotExist from "../../Default/domain/exceptions/UserNotExist";
import { CONFIG_TOKEN } from "../../Default/configs/config";

export interface AuthResponse {
  userId: string;
  email: string;
  username: string;
  pendingToVerified: boolean;
  token: string | null;
}

export default class UserAuthenticatorCase {
  constructor(readonly authRepository: AuthRepository) {}
  async run(user: string, password: string): Promise<AuthResponse> {
    const secretKeyToken = process.env.SECRET_KEY_TOKEN;
    if (!secretKeyToken) {
      throw new Error("Secret key not found");
    }

    const userCredentialsFound = await this.authRepository.findUserCredentials(
      user,
    );

    if (!userCredentialsFound) {
      throw new UserNotExist(user);
    }

    if (userCredentialsFound.deletedAt !== null) {
      await this.authRepository.activateAccount(userCredentialsFound.userId);
    } else if (!userCredentialsFound.state) {
      throw new AccountDeactivated();
    }

    const validation: boolean = await compare(
      password,
      userCredentialsFound.password,
    );
    if (!validation) {
      throw new PasswordIncorrect();
    }

    const token: string | null = userCredentialsFound.emailVerified
      ? sign(
          {
            userId: userCredentialsFound.userId,
            username: userCredentialsFound.username,
          },
          secretKeyToken,
          CONFIG_TOKEN,
        )
      : null;

    return {
      userId: userCredentialsFound.userId,
      email: userCredentialsFound.email,
      username: userCredentialsFound.username,
      pendingToVerified: !userCredentialsFound.emailVerified,
      token,
    };
  }
}
