import type UserRepository from "../domain/UserRepository";
import type UserRequesting from "../domain/UserRequesting";

export default class ObtainRequestsCase {
  constructor(readonly userRepository: UserRepository) {}
  async run(userId: string): Promise<Array<UserRequesting<string>>> {
    const usersRequestingFound: Array<UserRequesting<string>> =
      await this.userRepository.getRequests(userId);
    return usersRequestingFound;
  }
}
