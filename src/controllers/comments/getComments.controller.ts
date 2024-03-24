import { Response, Request } from "express";
import MongoPostRepository from "../../database/repositories/MongoPostRepository";
import ErrorHandler from "../../helpers/ErrorHandler";

export default class GetCommentsController {
  constructor(
    readonly postRepository: MongoPostRepository,
    readonly errorHandler: ErrorHandler
  ) {}
  async run(req: Request, res: Response) {
    try {
      const { id_post } = req.params;
      const { page } = req.query;
      const comments = await this.postRepository.getComments(
        id_post,
        parseInt(page as string) || 1
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
