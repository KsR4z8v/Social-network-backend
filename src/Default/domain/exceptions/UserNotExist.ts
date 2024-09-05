import ExceptionServer from "./ExceptionServer";

export default class UserNotExist extends ExceptionServer {
  constructor(messsage?: string) {
    super("USER_NOT_EXIST", 103, `El usuario ${messsage} no existe`, 404);
  }
}
