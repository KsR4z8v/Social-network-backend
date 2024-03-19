import { Request, Response } from "express";
import MongoPostRepository from "../../database/repositories/MongoPostRepository";
import ErrorHandler from "../../helpers/ErrorHandler";

export default class LikePostController {
  constructor(
    readonly postRepository: MongoPostRepository,
    readonly errorHandler: ErrorHandler
  ) {}
  async run(req: Request, res: Response) {
    try {
      const { id_post, id_user } = req.params;

      await this.postRepository.like(id_user, id_post);
      return res.status(200).json({ state: "ok" });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
