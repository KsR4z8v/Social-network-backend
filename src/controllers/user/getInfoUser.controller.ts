import { Request, Response } from "express";
import getDataToken from "../../helpers/getDataToken";
import MongoUserRepository from "../../database/repositories/MongoUserRepository";
import ErrorHandler from "../../helpers/ErrorHandler";
import UserNotExist from "../../exceptions/UserNotExist";

export default class GetInfoUserController {
  constructor(
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler
  ) {}
  async run(req: Request, res: Response) {
    try {
      const { id_user } = req.params;
      const { payload } = getDataToken(req);
      const id_user_tk = payload.id_user;

      let user_found: Record<string, any>;
      let info: Record<string, any> = {};

      if (id_user != id_user_tk) {
        user_found = await this.userRepository.get({ id_user });
        if (!user_found) {
          throw new UserNotExist();
        }
        if (!user_found.user_preferences.profileView) {
          info = {
            countfriends: user_found.friends.length,
            countposts: user_found.posts.length,
          };
          user_found.posts = [];
          user_found.friends = [];
        }
      } else {
        user_found = await this.userRepository.find({ id_user });
      }
      if (!user_found) {
        throw new UserNotExist();
      }
      user_found.password = undefined;
      user_found.doc_deleted = undefined;

      return res
        .status(200)
        .json({ state: "ok", data: { user: user_found, info } });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
