import type ErrorHandler from "../../../Default/helpers/ErrorHandler";
import { type Request, type Response } from "express";
import CreatePostCase from "../../application/CreatePostCase";

export default class CreatePostController {
  constructor(
    readonly createPostCase: CreatePostCase,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<any> {
    try {
      const { text, imagesToUpload } = req.body;

      const userId: string = req.session.user!.userId;

      const postId: string = await this.createPostCase.run(
        userId,
        text,
        imagesToUpload,
      );

      return res.status(200).json({
        state: "ok",
        data: {
          postId,
        },
      });
    } catch (error) {
      this.errorHandler.run(req, res, error);
    }
  }
}
