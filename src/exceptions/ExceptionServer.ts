export default class ExceptionServer extends Error {
  constructor(
    readonly type: string,
    readonly code: number,
    readonly message: string,
    readonly httpCode: number
  ) {
    super(message);
    this.stack = "";
  }
}
