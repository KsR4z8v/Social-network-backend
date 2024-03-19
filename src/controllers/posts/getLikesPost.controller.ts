import { Request, Response } from "express";
import MongoPostRepository from "../../database/repositories/MongoPostRepository";
import ErrorHandler from "../../helpers/ErrorHandler";

export default class GetLikesPostController {
  constructor(
    readonly postRepository: MongoPostRepository,
    readonly errorHandler: ErrorHandler
  ) {}
  async run(req: Request, res: Response) {
    try {
      const id_post = req.params.id_post;
      const likes = await this.postRepository.getLikes(id_post);

      return res.status(200).json({ state: "ok", data: { id_post, likes } });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
