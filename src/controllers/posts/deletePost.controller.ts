/* eslint-disable @typescript-eslint/naming-convention */
import { type Request, type Response } from "express";
import type MongoPostRepository from "../../database/repositories/MongoPostRepository.js";
import getDataToken from "../../helpers/getDataToken";
import type ErrorHandler from "../../helpers/ErrorHandler";

export default class DeletePostController {
  constructor(
    readonly postRepository: MongoPostRepository,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { id_post } = req.params;
      const { payload } = getDataToken(req);

      const postFound = await this.postRepository.find(id_post);

      if (postFound.author.toString() !== payload.id_user) {
        return res.status(403).json({
          message: `La publicacion que intenta eliminar no pertenece al usuario ${payload.id_user}`,
        });
      }
      await this.postRepository.delete(id_post);
      return res.sendStatus(204);
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
