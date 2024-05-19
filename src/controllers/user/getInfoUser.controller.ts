import { type Request, type Response } from "express";
import getDataToken from "../../helpers/getDataToken";
import type MongoUserRepository from "../../database/repositories/MongoUserRepository";
import type ErrorHandler from "../../helpers/ErrorHandler";

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

      const userFound = await this.userRepository.find(user, idUserToken);

      // format response
      const objectRes: Record<string, unknown> = {};
      objectRes.id_user = userFound._id;
      objectRes.bio = userFound.bio;
      objectRes.username = userFound.username;
      objectRes.fullname = userFound.fullname;
      objectRes.countFriends = userFound.countFriends;
      objectRes.countPosts = userFound.countPosts;
      objectRes.username = userFound.username;
      objectRes.verified = userFound.verified;
      objectRes.avatar = userFound.avatar;
      objectRes.user_preferences = userFound.user_preferences;

      if (userFound._id.toString() === idUserToken) {
        objectRes.phoneNumber = userFound.phone_number;
        objectRes.dateBorn = userFound.date_born;
        objectRes.email = userFound.email;
        objectRes.user_preferences = userFound.user_preferences;
        objectRes.account_settings = userFound.account_settings;
      } else {
        objectRes.friend = userFound.friends[0]
          ? { id_relation: userFound.friends[0]._id }
          : undefined;
        objectRes.requestSent = userFound.requests[0]
          ? { id_request: userFound.requests[0]._id }
          : undefined;
        objectRes.requestReceived = userFound.my_requests_sent[0]
          ? {
              id_request: userFound.my_requests_sent[0]._id,
            }
          : undefined;
      }
      return res.status(200).json({ state: "ok", data: { user: objectRes } });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
