import { type Request, type Response } from "express";
import type UserAuthenticatorCase from "../../application/UserAuthenticatorCase";
import type ErrorHandler from "../../../Default/helpers/ErrorHandler";
import type SendVerifiedEmailCase from "../../../Default/application/SendVerifiedEmailCase";
import { CONFIG_COOKIE_TOKEN } from "../../../Default/configs/config";

export default class AuthController {
  constructor(
    readonly userAuthenticatorCase: UserAuthenticatorCase,
    readonly sendVerifiedEmailCase: SendVerifiedEmailCase,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { user, password } = req.body;

      const { userId, username, email, pendingToVerified, token } =
        await this.userAuthenticatorCase.run(String(user), String(password));

      if (pendingToVerified) {
        await this.sendVerifiedEmailCase.run(userId, username, email);
      }
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
          pendingToVerified,
          token,
        },
      });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
