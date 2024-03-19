import { Request, Response } from "express";
import MongoPostRepository from "../../database/repositories/MongoPostRepository.js";
import getDataToken from "../../helpers/getDataToken";
import ErrorHandler from "../../helpers/ErrorHandler";

export default class DeletePostController {
  constructor(
    readonly postRepository: MongoPostRepository,
    readonly errorHandler: ErrorHandler
  ) {}
  async run(req: Request, res: Response) {
    try {
      const { id_post } = req.params;
      const { payload } = getDataToken(req);

      const post_found = await this.postRepository.find(id_post);

      if (post_found.author.toString() !== payload.id_user) {
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
