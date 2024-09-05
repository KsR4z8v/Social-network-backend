/* eslint-disable @typescript-eslint/naming-convention */
import { type Request, type Response } from "express";
import type ErrorHandler from "../../../Default/helpers/ErrorHandler";
import type DeleteUserCase from "../../application/DeleteUserCase";
import UnauthorizedAction from "../../../Default/domain/exceptions/UnauthorizedAction";

export default class DeleteUserController {
  constructor(
    readonly deleteUserCase: DeleteUserCase,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { userId } = req.params;
      if (userId !== req.session.user?.userId) {
        throw new UnauthorizedAction();
      }
      req.session.destroy((err) => {});
      res.clearCookie("tkn");
      await this.deleteUserCase.run(userId);
      return res.sendStatus(204);
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
