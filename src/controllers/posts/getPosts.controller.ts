import dotenv from "dotenv";
import { type Response, type Request } from "express";
import type MongoPostRepository from "../../database/repositories/MongoPostRepository";
import type ErrorHandler from "../../helpers/ErrorHandler";
import getDataToken from "../../helpers/getDataToken";
import type MongoUserRepository from "../../database/repositories/MongoUserRepository";
import IncorrectDataRequest from "../../exceptions/IncorrectDataRequest";
import type User from "../../database/models/User";

dotenv.config();

export default class GetPostsController {
  constructor(
    readonly postRepository: MongoPostRepository,
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { user, cursor, query } = req.query;
      const { payload } = getDataToken(req);

      // verifico el cursor
      let date: Date | undefined;
      if (cursor) {
        const s = parseInt(cursor as string);
        if (!s || s > new Date().getTime()) {
          throw new IncorrectDataRequest(
            "el cursor es incorrecto, debe ser numerico",
          );
        }
        date = new Date(parseInt(cursor as string));
      }

      if (user) {
        // verifico datos del usuario
        const userFound: User = await this.userRepository.find(user as string);
        if (payload.idUser !== user && !userFound.userPreferences.profileView) {
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
          payload.idUser as string,
        );
      } else {
        posts = await this.postRepository.getAll(
          {
            author: user,
          },
          payload.idUser as string,
          date,
        );
      }

      res.status(200).json({
        state: "ok",
        data: {
          posts,
          cursor: posts[posts.length - 1]?.createdAt.getTime(),
        },
      });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
