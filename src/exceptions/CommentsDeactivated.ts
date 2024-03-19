import ExceptionServer from "./ExceptionServer";

export default class CommentsDeactivated extends ExceptionServer {
  constructor(message?: string) {
    super(
      "COMMENTS_DEACTIVATED",
      107,
      `La publicacion ${message} tiene los comentarios desactivados`,
      403
    );
  }
}
