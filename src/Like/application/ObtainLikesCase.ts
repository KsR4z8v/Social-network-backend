import type Like from "../domain/Like";
import type LikeRepository from "../domain/LikeRepository";

export default class ObtainLikesCase {
  constructor(readonly likeRepository: LikeRepository) {}
  async run(userId: string, from: string): Promise<Array<Like<string>>> {
    const likesFound = this.likeRepository.obtain(
      new Map<string, string>([["to", from]]),
    );
    return likesFound;
  }
}
