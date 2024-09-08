import { type Request, type Response } from "express";
import type DeletePostCase from "../../application/DeletePostCase";
import type ErrorHandler from "../../../Default/helpers/ErrorHandler";

export default class DeletePostController {
  constructor(
    readonly deletePostCase: DeletePostCase,
    readonly errorHandler: ErrorHandler,
  ) {}
  async run(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const userId: string = req.session.user!.userId;

      await this.deletePostCase.run(userId, postId);

      res.sendStatus(204);
    } catch (error) {
      this.errorHandler.run(req, res, error);
    }
  }
}
