import ExceptionServer from "./ExceptionServer";

export default class AccountDeactivated extends ExceptionServer {
  constructor() {
    super(
      "ACCOUNT_DEACTIVATED",
      104,
      "La cuenta se encuentra  desactivada",
      403
    );
  }
}
