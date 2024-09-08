import type Post from "./Post";
import type PostCreate from "./PostCreate";

export default interface PostRepository {
  create: (post: PostCreate<string>) => Promise<string>;
  get: (
    userId: string,
    criteria: Map<string, unknown>,
  ) => Promise<Array<Post<string>>>;
  delete: (userId: string, postId: string) => Promise<void>;
  find: (postId: string) => Promise<Post<string>>;
  //searchByIndex: (query: string) => Promise<Array<Post<string>>>;
}
