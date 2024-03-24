import ExceptionServer from "./ExceptionServer";

export default class RequestNotExist extends ExceptionServer {
  constructor(messsage?: string) {
    super(
      "REQUEST_NOT_EXIST",
      114,
      `La solicitud no existe ${messsage} no existe`,
      404
    );
  }
}
