import ExceptionServer from "./ExceptionServer";

export default class VerificationCodeIncorrect extends ExceptionServer {
  constructor() {
    super(
      "VERIFICATION_CODE_INCORRECT",
      109,
      `El codigo de verificacion es incorrecto`,
      401
    );
  }
}
