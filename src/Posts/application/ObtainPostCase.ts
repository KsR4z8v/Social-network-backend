import type PostRepository from "../domain/PostRepository";
import type Post from "../domain/Post";

export default class ObtainPostCase {
  constructor(readonly postRepository: PostRepository) {}

  async run(
    userId: string,
    criteria: Map<string, unknown>,
  ): Promise<Post<string>[]> {
    const posts = await this.postRepository.get(userId, criteria);
    return posts;
  }
}
