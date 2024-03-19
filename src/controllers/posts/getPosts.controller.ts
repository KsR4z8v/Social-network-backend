import dotenv from "dotenv";
import { Response, Request } from "express";
import MongoPostRepository from "../../database/repositories/MongoPostRepository";
import ErrorHandler from "../../helpers/ErrorHandler";
dotenv.config();

export default class GetPostsController {
  constructor(
    readonly postRepository: MongoPostRepository,
    readonly errorHandler: ErrorHandler
  ) {}
  async run(req: Request, res: Response) {
    try {
      const { id_user } = req.params;
      const { byuser, cursorIdPost, querySearch } = req.query;
      // console.log(parseInt(by_user) === id_user);

      //?console.log({ by_user, cursorIdPost, querySearch });

      let posts = await this.postRepository.getAll(
        {
          id_user: byuser,
          querySearch,
        },
        cursorIdPost?.toString()
      );

      res.status(200).json({
        state: "ok",
        data: { posts },
      });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
