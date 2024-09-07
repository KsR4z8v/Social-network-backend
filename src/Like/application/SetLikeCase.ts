import type PostRepository from "../../Posts/domain/PostRepository";
import type LikeRepository from "../domain/LikeRepository";

export default class SetLikeCase {
  constructor(
    readonly likeRepository: LikeRepository,
    readonly postRepository: PostRepository,
  ) {}

  async run(userId: string, to: string, type: string): Promise<string> {
    const likeId = await this.likeRepository.like(userId, to, type);
    return likeId;
  }
}
