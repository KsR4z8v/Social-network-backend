import ExceptionServer from "./ExceptionServer";

export default class TokenGoogleInvalid extends ExceptionServer {
  constructor() {
    super("GOOGLE_TOKEN_INVALID", 102, "Token  is not valid", 401);
    this.stack = "";
  }
}
