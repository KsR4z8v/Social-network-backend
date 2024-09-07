import ExceptionServer from "./ExceptionServer";

export default class IncorrectDataFormat extends ExceptionServer {
  constructor(type: string, message?: string) {
    super(
      `INCORRECT_${type.toLocaleUpperCase()}_FORMAT`,
      110,
      `El formato es incorrecto  ${message ?? "-> " + `"${message}"`} `,
      422,
    );
    this.stack = "";
  }
}
