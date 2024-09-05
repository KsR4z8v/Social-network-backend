/* eslint-disable @typescript-eslint/naming-convention */
import { type Request, type Response } from "express";
import type ErrorHandler from "../../../Default/helpers/ErrorHandler";
import type UpdatePasswordCase from "../../application/UpdatePasswordCase";

export default class UpdatePasswordController {
  constructor(
    readonly updatePasswordCase: UpdatePasswordCase,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { userId } = req.params;
      const { newPassword, oldPassword } = req.body;
      await this.updatePasswordCase.run(
        userId,
        String(oldPassword),
        String(newPassword),
      );
      return res.sendStatus(204);
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
