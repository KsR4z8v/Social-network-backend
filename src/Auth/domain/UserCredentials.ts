export default class UserCredentials<T> {
  constructor(
    readonly userId: T,
    readonly password: string,
    readonly emailVerified: boolean,
    readonly state: boolean,
    readonly email: string,
    readonly username: string,
    readonly lastConnection: Date,
    readonly ip: string[],
    readonly deletedAt: Date | null,
  ) {}
}
