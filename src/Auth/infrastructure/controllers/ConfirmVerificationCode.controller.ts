/* eslint-disable @typescript-eslint/naming-convention */
import { type Request, type Response } from "express";
import type ErrorHandler from "../../../Default/helpers/ErrorHandler";
import type ConfirmVerificationCodeCase from "../../application/ConfirmVerificationCodeCase";
import { CONFIG_COOKIE_TOKEN } from "../../../Default/configs/config";

export default class ConfirmVerificationCodeController {
  constructor(
    readonly confirmVerificationCode: ConfirmVerificationCodeCase,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { userId } = req.params;
      const { code } = req.body;

      const token = await this.confirmVerificationCode.run(
        userId,
        String(code),
      );
      req.session.user = {
        authToken: token,
        userId,
        role: "user",
        restoreToken: null,
        username: "",
      };
      res.cookie("tkn", token, CONFIG_COOKIE_TOKEN);

      return res.status(200).json({
        state: "ok",
        data: { userId, token },
      });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
