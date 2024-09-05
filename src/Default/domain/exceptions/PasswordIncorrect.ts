import ExceptionServer from "./ExceptionServer";

export default class PasswordIncorrect extends ExceptionServer {
  constructor(message?: string) {
    super(
      "PASSWORD_INCORRECT",
      101,
      message ?? "La contraseña es incorrecta, intenta nuevamente",
      401,
    );
    this.stack = "";
  }
}
