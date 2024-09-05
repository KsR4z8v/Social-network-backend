import type Image from "../../Default/domain/Image";

export default class PostCreate<T> {
  constructor(
    readonly author: T,
    readonly text: string | null,
    readonly media: Image[],
  ) {}
}
