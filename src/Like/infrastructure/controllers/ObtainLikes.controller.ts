import { type Request, type Response } from "express";
import type ErrorHandler from "../../../Default/helpers/ErrorHandler";
import ObtainLikesCase from "../../application/ObtainLikesCase";

export default class CreateLikeController {
  constructor(
    readonly obtainLikeCase: ObtainLikesCase,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { from } = req.params;

      const userId = req.session.user!.userId;

      const likes = await this.obtainLikeCase.run(userId, from);

      return res.status(200).json({
        state: "ok",
        data: {
          likes,
        },
      });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
