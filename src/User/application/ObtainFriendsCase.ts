import type Friend from "../domain/Friend";
import type UserRepository from "../domain/UserRepository";

export default class ObtainFriendsCase {
  constructor(readonly userRepository: UserRepository) {}
  async run(
    user: string,
    externalUserId: string = "",
    page: number = 1,
  ): Promise<Array<Friend<string>>> {
    const userFound = await this.userRepository.find(user, externalUserId);

    if (!userFound.profileView && userFound.id !== externalUserId) {
      throw new Error("Profile private");
    }

    const friendsFound = await this.userRepository.getFriends(
      userFound.id,
      externalUserId,
      page,
    );

    return friendsFound;
  }
}
