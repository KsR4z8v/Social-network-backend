/* eslint-disable @typescript-eslint/naming-convention */
import { type Request, type Response } from "express";
import type ErrorHandler from "../../../Default/helpers/ErrorHandler";
import type SendEmailCase from "../../application/SendEmailCase";

export default class SendEmailController {
  constructor(
    readonly sendEmailCase: SendEmailCase,
    readonly errorHandler: ErrorHandler
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { user, type } = req.params;
      await this.sendEmailCase.run(user, type);
      return res.sendStatus(204);
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
