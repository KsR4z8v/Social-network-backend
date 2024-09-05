import ExceptionServer from "./ExceptionServer";

export default class PostNotExist extends ExceptionServer {
  constructor(messsage?: string) {
    super("POST_NOT_EXIST", 107, `la publicacion ${messsage} no existe`, 404);
  }
}
