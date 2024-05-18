import { type Request, type Response } from "express";
import getDataToken from "../../helpers/getDataToken";
import type MongoUserRepository from "../../database/repositories/MongoUserRepository";
import type ErrorHandler from "../../helpers/ErrorHandler";
import type User from "../../database/models/User";

export default class GetInfoUserController {
  constructor(
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { user } = req.params;
      const { payload } = getDataToken(req);
      const idUserToken: string = payload.idUser;

      const userFound: User = await this.userRepository.find(user, idUserToken);

      const objectRes: Record<string, unknown> = {};
      objectRes.id_user = userFound.id;
      objectRes.bio = userFound.bio;
      objectRes.username = userFound.username;
      objectRes.fullname = userFound.fullname;
      objectRes.countFriends = userFound.countFriends;
      objectRes.countPosts = userFound.countPosts;
      objectRes.username = userFound.username;
      objectRes.verified = userFound.verified;
      objectRes.avatar = userFound.avatar;

      objectRes.user_preferences = userFound.userPreferences;

      if (userFound.id === idUserToken) {
        objectRes.phoneNumber = userFound.phoneNumber;
        objectRes.dateBorn = userFound.dateBorn;
        objectRes.email = userFound.email;
        objectRes.user_preferences = userFound.userPreferences;
        objectRes.account_settings = userFound.accountSettings;
      } else {
        objectRes.myFriend = userFound.myFriend;
        objectRes.requestSent = userFound.requestSent;
        objectRes.requestReceived = userFound.requestReceived;
      }

      return res.status(200).json({ state: "ok", data: { user: objectRes } });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
