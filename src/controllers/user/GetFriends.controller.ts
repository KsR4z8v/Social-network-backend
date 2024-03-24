import { Request, Response } from "express";
import getDataToken from "../../helpers/getDataToken";
import MongoUserRepository from "../../database/repositories/MongoUserRepository";
import ErrorHandler from "../../helpers/ErrorHandler";

export default class GetFriendsController {
  constructor(
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler
  ) {}
  async run(req: Request, res: Response) {
    try {
      const { user } = req.params;
      const { page } = req.query;
      const { payload } = getDataToken(req);
      const id_user_tk = payload.id_user;

      const user_found = await this.userRepository.find(user);
      if (
        user_found._id.toString() !== id_user_tk &&
        !user_found.user_preferences.profileView
      ) {
        return res.status(200).json({
          state: "ok",
          data: { friends: [] },
          message: "Este usuraio tiene su perfil privado",
        });
      }

      const friends_found = await this.userRepository.getRelationFields(
        user_found._id.toString(),
        "friends",
        id_user_tk,
        parseInt(page as string)
      );

      return res
        .status(200)
        .json({ state: "ok", data: { friends: friends_found } });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
