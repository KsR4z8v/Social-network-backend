import { type Request, type Response } from "express";
import type ErrorHandler from "../../../Default/helpers/ErrorHandler";
import type GoogleAuthenticatorCase from "../../application/GoogleAuthenticatorCase";
import { CONFIG_COOKIE_TOKEN } from "../../../Default/configs/config";

export default class GoogleAuthController {
  constructor(
    readonly googleAuthenticatorCase: GoogleAuthenticatorCase,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { credential, clientId } = req.body;

      const { userId, username, token, pendingToVerified } =
        await this.googleAuthenticatorCase.run(clientId, credential);

      if (token) {
        req.session.user = {
          userId,
          username,
          authToken: token,
          restoreToken: null,
          role: "user",
        };
        res.cookie("tkn", token, CONFIG_COOKIE_TOKEN);
      }

      return res.status(200).json({
        state: "ok",
        data: {
          userId,
          username,
          pendingToVerified,
          token,
        },
      });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
