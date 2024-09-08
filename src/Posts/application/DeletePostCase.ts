import type PostRepository from "../domain/PostRepository";

export default class DeletePostCase {
  constructor(readonly postRepository: PostRepository) {}
  async run(userId: string, postId: string): Promise<void> {
    await this.postRepository.delete(userId, postId);
  }
}
