import ExceptionServer from "./ExceptionServer";

export default class SessionRequired extends ExceptionServer {
  constructor() {
    super(
      "SESSION_REQUIRED",
      594,
      "A session is required to perform this action",
      401,
    );
  }
}
