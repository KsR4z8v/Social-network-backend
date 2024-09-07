import type SendVerifiedEmailCase from "../../Default/application/SendVerifiedEmailCase";
import DataAlreadyExist from "../../Default/domain/exceptions/DataAlreadyExist";
import type UserCreate from "../domain/UserCreate";
import type UserRepository from "../domain/UserRepository";

export default class CreateUserCase {
  constructor(
    readonly userRepository: UserRepository,
    readonly sendVerifiedEmailCase: SendVerifiedEmailCase,
  ) {}

  async run(user: UserCreate): Promise<string> {
    const userFound = await this.userRepository.exist({
      email: user.email,
      username: user.username,
      userId: "",
    });

    if (userFound) {
      throw new DataAlreadyExist(
        userFound.username === user.username ? "nombre de usuario" : "correo",
      );
    }

    await user.hashPassword();

    const insertedId: string = await this.userRepository.create(user);

    await this.sendVerifiedEmailCase.run(insertedId, user.username, user.email);

    return insertedId;
  }
}
