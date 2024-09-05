import type UserRepository from "../domain/UserRepository";

export default class DeleteUserCase {
  constructor(readonly userRepository: UserRepository) {}
  async run(userId: string): Promise<void> {
    await this.userRepository.delete(userId);
  }
}
