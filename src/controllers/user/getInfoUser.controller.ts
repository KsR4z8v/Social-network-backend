import { Request, Response } from "express";
import getDataToken from "../../helpers/getDataToken";
import MongoUserRepository from "../../database/repositories/MongoUserRepository";
import ErrorHandler from "../../helpers/ErrorHandler";

export default class GetInfoUserController {
  constructor(
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler
  ) {}
  async run(req: Request, res: Response) {
    try {
      const { user } = req.params;
      const { payload } = getDataToken(req);
      const id_user_tk = payload.id_user;

      let user_found: Record<string, any>;

      if (user != id_user_tk) {
        user_found = await this.userRepository.find(
          user as string,
          true,
          id_user_tk
        );
      } else {
        user_found = await this.userRepository.find(user as string);
      }
      user_found.password = undefined;

      return res.status(200).json({ state: "ok", data: { user: user_found } });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
