import ExceptionServer from "./ExceptionServer";

export default class TokenGoogleInvalid extends ExceptionServer {
  constructor() {
    super("GOOGLE_TOKEN_INVALID", 102, "The token is invalid", 401);
    this.stack = "";
  }
}
