import { type Request, type Response } from "express";
import type RestorePasswordCase from "../../application/RestorePasswordCase";
import type ErrorHandler from "../../../Default/helpers/ErrorHandler";
import IncorrectDataFormat from "../../../Default/domain/exceptions/IncorrectDataFormat";

export default class RestorePasswordController {
  constructor(
    readonly restorePasswordCase: RestorePasswordCase,
    readonly errorHandler: ErrorHandler
  ) {}
  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { token } = req.params;
      const { password } = req.body;
      //TODO separar logica
      if (password.length < 6) {
        throw new IncorrectDataFormat(
          "password",
          `${password} La contraseña debe tener como mínimo 5 caracteres`
        );
      }
      if (!/\d/.test(password)) {
        throw new IncorrectDataFormat(
          "password",
          `${password} La contraseña debe tener almenos un caracter`
        );
      }
      if (password.includes(" ")) {
        throw new IncorrectDataFormat(
          "password",
          `${password} La contraseña no debe tener espacios`
        );
      }
      await this.restorePasswordCase.run(token, password);
      return res.sendStatus(204);
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
