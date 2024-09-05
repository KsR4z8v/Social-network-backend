import type UserRepository from "../domain/UserRepository";

export default class DeleteRelationCase {
  constructor(readonly userRepository: UserRepository) {}
  async run(userId: string, relationId: string, type: string): Promise<void> {
    if (type === "request") {
      await this.userRepository.deleteRequest(userId, relationId);
    } else {
      await this.userRepository.deleteFriend(userId, relationId);
    }
  }
}
