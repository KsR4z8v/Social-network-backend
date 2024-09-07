import { emit } from "process";
import validateCredentialsGoogle from "../../Default/helpers/validationTokenGoogle";
import type CreateUserCase from "../../User/application/CreateUserCase";
import UserCreate from "../../User/domain/UserCreate";
import type UserRepository from "../../User/domain/UserRepository";
import type AuthRepository from "../domain/AuthRepository";

import { AuthResponse } from "./UserAuthenticatorCase";
import { sign } from "jsonwebtoken";
import { CONFIG_TOKEN } from "../../Default/configs/config";

export default class GoogleAuthenticatorCase {
  constructor(
    readonly authRepository: AuthRepository,
    readonly userRepository: UserRepository,
  ) {}

  async run(clientId: string, credentials: string): Promise<AuthResponse> {
    const googleClientId: string = process.env.GOOGLE_CLIENT_ID ?? "";

    const secretKeyToken = process.env.SECRET_KEY_TOKEN;

    if (!secretKeyToken) {
      throw new Error("Secret key not found");
    }

    if (clientId !== googleClientId) {
      throw Error("The client id is different");
    }

    const { email, given_name, picture, name, email_verified } =
      await validateCredentialsGoogle(credentials, googleClientId);

    const userFound = await this.userRepository.exist({
      email: String(email),
      username: String(given_name),
      userId: "",
    });

    let userId: string;

    if (!userFound) {
      const newUser: UserCreate = new UserCreate(
        String(given_name),
        String(email),
        {
          url: String(picture),
          externalId: null,
          thumbnailUrl: String(picture),
        },
        String(name),
        "12354",
        new Date(),
        null,
        null,
      );

      userId = await this.userRepository.create(newUser);
    } else {
      userId = userFound.userId;
    }

    const token: string = sign(
      {
        userId,
        username: String(given_name),
      },
      secretKeyToken,
      CONFIG_TOKEN,
    );
    return {
      email: String(email),
      pendingToVerified: !Boolean(email_verified),
      username: String(given_name),
      token,
      userId,
    };
  }
}
