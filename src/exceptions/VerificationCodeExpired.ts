import ExceptionServer from "./ExceptionServer";

export default class VerificationCodeExpired extends ExceptionServer {
  constructor() {
    super(
      "VERIFICATION_CODE_EXPIRED",
      108,
      `El codigo de verificacion ha expirado`,
      401
    );
  }
}
