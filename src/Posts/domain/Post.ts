import type Image from "../../Default/domain/Image";

export default class Post<T> {
  constructor(
    readonly id: T,
    readonly authorId: T,
    readonly authorUrlAvatar: string,
    readonly authorUsername: string,
    readonly authorCheckVerified: boolean,
    readonly comments: boolean,
    readonly text: string,
    readonly countLikes: number,
    readonly countComments: number,
    readonly media: Image[],
    readonly createdAt: Date,
    readonly liked: boolean,
  ) {}
}
