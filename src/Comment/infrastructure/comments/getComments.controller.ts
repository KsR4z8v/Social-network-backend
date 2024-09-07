/* eslint-disable @typescript-eslint/naming-convention */
import { type Response, type Request } from "express";
import type MongoPostRepository from "../../../Posts/infrastructure/repositories/MongoPostRepository";
import type ErrorHandler from "../../../Default/helpers/ErrorHandler";

export default class GetCommentsController {
  constructor(
    readonly postRepository: MongoPostRepository,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { id_post } = req.params;
      const { page } = req.query;
      const comments = await this.postRepository.getComments(
        id_post,
        parseInt(page as string) || 1,
      );
      return res.status(200).json({
        state: "ok",
        data: {
          id_post,
          comments,
          cursor: page ? parseInt(page as string) + 1 : 2,
        },
      });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
