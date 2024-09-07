export default class Friend<T> {
  constructor(
    readonly id: T,
    readonly username: string,
    readonly avatar: string,
    readonly checkVerified: boolean,
    readonly relationExternalId: T | null,
    readonly requestSentExternalId: T | null,
    readonly requestReceivedExternalId: T | null,
  ) {}
}
