import ExceptionServer from "./ExceptionServer";

class FailureToLoadMedia extends ExceptionServer {
  constructor() {
    super(
      "FAILURE_UPLOAD_MEDIA",
      100,
      "hubo un error al subir los archivos porfavor intetna mas tarde",
      500
    );
    this.stack = "";
  }
}

export default FailureToLoadMedia;
