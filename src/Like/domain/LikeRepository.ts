import type Like from "./Like";

export default interface LikeRepository {
  obtain: (criteria: Map<string, string>) => Promise<Array<Like<string>>>;
  like: (userId: string, to: string, type: string) => Promise<string>;
}
