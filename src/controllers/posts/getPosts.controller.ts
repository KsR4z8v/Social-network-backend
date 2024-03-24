import dotenv from "dotenv";
import { Response, Request } from "express";
import MongoPostRepository from "../../database/repositories/MongoPostRepository";
import ErrorHandler from "../../helpers/ErrorHandler";
import getDataToken from "../../helpers/getDataToken";
import MongoUserRepository from "../../database/repositories/MongoUserRepository";
import IncorrectDataRequest from "../../exceptions/IncorrectDataRequest";

dotenv.config();

export default class GetPostsController {
  constructor(
    readonly postRepository: MongoPostRepository,
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler
  ) {}
  async run(req: Request, res: Response) {
    try {
      const { user, cursor, query } = req.query;
      const { payload } = getDataToken(req);

      //verifico el cursor
      let date: Date | undefined;
      if (cursor) {
        const s = parseInt(cursor as string);
        if (!s || s > new Date().getTime()) {
          throw new IncorrectDataRequest(
            "el cursor es incorrecto, debe ser numerico"
          );
        }
        date = new Date(parseInt(cursor as string));
      }

      if (user) {
        //verifico datos del usuario
        const user_found = await this.userRepository.find(user as string, true);
        if (
          payload.id_user !== user &&
          !user_found.user_preferences.profileView
        ) {
          return res.status(200).json({
            state: "ok",
            data: { posts: [] },
            message: "Este usuraio tiene su perfil privado",
          });
        }
      }

      let posts;
      if (query) {
        posts = await this.postRepository.getBySearchIndex(
          (query as string) || "",
          payload.id_user
        );
      } else {
        posts = await this.postRepository.getAll(
          {
            author: user,
          },
          payload.id_user,
          date
        );
      }

      res.status(200).json({
        state: "ok",
        data: {
          posts: posts,
          cursor: posts[posts.length - 1]?.createdAt.getTime(),
        },
      });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
