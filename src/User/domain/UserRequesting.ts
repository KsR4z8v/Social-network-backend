export default class UserRequesting<T> {
  constructor(
    readonly id: T,
    readonly requestId: T,
    readonly username: string,
    readonly avatar: string,
  ) {}
}
