/* eslint-disable @typescript-eslint/naming-convention */
import { type Request, type Response } from "express";
import type MongoPostRepository from "../Posts/infrastructure/repositories/MongoPostRepository";
import type ErrorHandler from "../Default/helpers/ErrorHandler";

export default class LikePostController {
  constructor(
    readonly postRepository: MongoPostRepository,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { id_post, id_user } = req.params;

      await this.postRepository.like(id_user, id_post);

      return res.status(200).json({ state: "ok" });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
