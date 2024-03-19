import e, { Request, Response } from "express";
import dotenv from "dotenv";
import ErrorHandler from "../../helpers/ErrorHandler";
dotenv.config();

export default class LogoutController {
  constructor(readonly errorHandler: ErrorHandler) {}
  run(req: Request, res: Response) {
    try {
      res.clearCookie("tkn");
      req.session.destroy(function (e) {
        if (e) {
          console.log(e);
        }
      });
      res.sendStatus(204);
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
