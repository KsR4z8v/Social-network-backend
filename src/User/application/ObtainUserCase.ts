import type User from "../domain/User";
import type UserRepository from "../domain/UserRepository";

export default class ObtainUserCase {
  constructor(readonly userRepository: UserRepository) {}
  async run(user: string, externalId?: string): Promise<User<string>> {
    const userFound: User<string> = await this.userRepository.find(
      user,
      externalId
    );
    return userFound;
  }
}
