import ExceptionServer from "./ExceptionServer";

export default class IncorrectDataRequest extends ExceptionServer {
  constructor(message?: string) {
    super(
      "INCORRECT_DATA_REQUEST",
      101,
      message ?? "El cuerpo es incorrecto",
      400,
    );
    this.stack = "";
  }
}
