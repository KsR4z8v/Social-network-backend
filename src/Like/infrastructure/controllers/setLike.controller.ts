import { type Request, type Response } from "express";
import type ErrorHandler from "../../../Default/helpers/ErrorHandler";
import type SetLikeCase from "../../application/SetLikeCase";

export default class LikeController {
  constructor(
    readonly setLikeCase: SetLikeCase,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { to, type } = req.params;

      const userId = req.session.user!.userId;

      const likeId: string = await this.setLikeCase.run(userId, to, type);

      return res.status(200).json({
        state: "ok",
        data: {
          likeId,
        },
      });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
