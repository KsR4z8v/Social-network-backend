import ExceptionServer from "./ExceptionServer";

export default class IncorrectDataRequest extends ExceptionServer {
  constructor(message?: string) {
    super(
      "INCORRECT_DATA_REQUEST",
      101,
      `El cuerpo es incorrecto  ${message ? "-> " + message : ""}`,
      400
    );
    this.stack = "";
  }
}
