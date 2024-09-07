import ExceptionServer from "./ExceptionServer";

export default class DataAlreadyExist extends ExceptionServer {
  constructor(message: string) {
    super("USER_ALREADY_EXIST", 105, `El ${message} ya esta en uso`, 409);
  }
}
