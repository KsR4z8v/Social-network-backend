/* eslint-disable @typescript-eslint/naming-convention */
import { type Request, type Response } from "express";
import type MongoPostRepository from "../../database/repositories/MongoPostRepository";
import type ErrorHandler from "../../helpers/ErrorHandler";
import getDataToken from "../../helpers/getDataToken";

export default class GetLikesPostController {
  constructor(
    readonly postRepository: MongoPostRepository,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { id_post } = req.params;
      const { page } = req.query;
      const { payload } = getDataToken(req);
      const likes = await this.postRepository.getLikes(
        id_post,
        parseInt(page as string) || 1,
        payload.id_user as string,
      );

      return res.status(200).json({ state: "ok", data: { id_post, likes } });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
