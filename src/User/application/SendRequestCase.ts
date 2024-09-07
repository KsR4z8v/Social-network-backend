import type UserRepository from "../domain/UserRepository";

export default class SendRequestCase {
  constructor(readonly userRepository: UserRepository) {}
  async run(
    submittedUserId: string,
    recipientUserId: string
  ): Promise<{ relationId: string } | { requestId: string }> {
    const requestInfo = await this.userRepository.sendRequest(
      submittedUserId,
      recipientUserId
    );
    return requestInfo;
  }
}
