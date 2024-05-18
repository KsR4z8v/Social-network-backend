import ExceptionServer from "./ExceptionServer";

export default class ActionSuspended extends ExceptionServer {
  constructor() {
    super(
      "ACTION_SUSPENDED",
      106,
      "Tu cuenta se encuentra suspendidad temporalmente",
      403,
    );
  }
}
