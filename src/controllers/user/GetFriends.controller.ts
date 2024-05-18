import { type Request, type Response } from "express";
import getDataToken from "../../helpers/getDataToken";
import type MongoUserRepository from "../../database/repositories/MongoUserRepository";
import type ErrorHandler from "../../helpers/ErrorHandler";

export default class GetFriendsController {
  constructor(
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { user } = req.params;
      const { page } = req.query;
      const { payload } = getDataToken(req);
      const idUserTk: string = payload.idUser;

      const userFound = await this.userRepository.find(user);
      if (userFound.id !== idUserTk && !userFound.userPreferences.profileView) {
        return res.status(200).json({
          state: "ok",
          data: { friends: [] },
          message: "Este usuraio tiene su perfil privado",
        });
      }

      const friendsFound = await this.userRepository.getRelationFields(
        userFound.id,
        "friends",
        idUserTk,
        parseInt(page as string),
      );

      return res
        .status(200)
        .json({ state: "ok", data: { friends: friendsFound } });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
