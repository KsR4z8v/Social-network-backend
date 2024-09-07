import { type Request, type Response } from "express";
import dotenv from "dotenv";
import type ErrorHandler from "../../../Default/helpers/ErrorHandler";
dotenv.config();

export default class LogoutController {
  constructor(readonly errorHandler: ErrorHandler) {}
  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      res.clearCookie("tkn");
      req.session.destroy(function (e) {
        if (e) {
          return res.sendStatus(500);
        }
      });
      return res.sendStatus(204);
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
