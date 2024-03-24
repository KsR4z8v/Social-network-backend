import { Request, Response } from "express";
import MongoPostRepository from "../../database/repositories/MongoPostRepository";
import ErrorHandler from "../../helpers/ErrorHandler";
import getDataToken from "../../helpers/getDataToken";

export default class GetLikesPostController {
  constructor(
    readonly postRepository: MongoPostRepository,
    readonly errorHandler: ErrorHandler
  ) {}
  async run(req: Request, res: Response) {
    try {
      const { id_post } = req.params;
      const { page } = req.query;
      const { payload } = getDataToken(req);
      const likes = await this.postRepository.getLikes(
        id_post,
        parseInt(page as string) || 1,
        payload.id_user
      );

      return res.status(200).json({ state: "ok", data: { id_post, likes } });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
