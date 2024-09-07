import { type Request, type Response } from "express";
import getDataToken from "../../../Default/helpers/getDataToken";
import type ErrorHandler from "../../../Default/helpers/ErrorHandler";
import type ObtainUserCase from "../../application/ObtainUserCase";
import type User from "../../domain/User";

export default class ObtainUserController {
  constructor(
    readonly obtainUserCase: ObtainUserCase,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { user } = req.params;

      const loggedUserId = req.session.user?.userId;

      const userFound: User<string> = await this.obtainUserCase.run(
        user,
        loggedUserId,
      );

      // Format response
      const objectRes: Record<string, unknown> = {};
      objectRes.id = userFound.id;
      objectRes.bio = userFound.bio;
      objectRes.username = userFound.username;
      objectRes.fullname = userFound.fullname;
      objectRes.countFriends = userFound.countFriends;
      objectRes.countPosts = userFound.countPosts;
      objectRes.username = userFound.username;
      objectRes.checkVerified = userFound.checkVerified;
      objectRes.avatar = { url: userFound.avatar.url };
      objectRes.profileView = userFound.profileView;
      objectRes.receiveRequests = userFound.receiveRequests;

      if (userFound.id === loggedUserId) {
        objectRes.phoneNumber = userFound.phoneNumber;
        objectRes.dateBorn = userFound.dateBorn;
        objectRes.email = userFound.email;
      } else {
        objectRes.myFriend = userFound.myFriend;
        objectRes.requestReceived = userFound.requestReceived;
        objectRes.requestSent = userFound.requestSent;
      }
      return res.status(200).json({ state: "ok", data: { user: objectRes } });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
