import ExceptionServer from "./ExceptionServer";

export default class PasswordIncorrect extends ExceptionServer {
  constructor() {
    super(
      "PASSWORD_INCORRECT",
      101,
      "la contraseña es incorrecta, intenta nuevamente",
      401
    );
    this.stack = "";
  }
}
