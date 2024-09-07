import ExceptionServer from "./ExceptionServer";

export default class UnauthorizedAction extends ExceptionServer {
  constructor() {
    super(
      "UNAUTHORIZED_ACTION",
      106,
      "Unauthorized to perform this action",
      403,
    );
  }
}
