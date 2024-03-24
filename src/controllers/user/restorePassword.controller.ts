import MongoUserRepository from "../../database/repositories/MongoUserRepository";
import ErrorHandler from "../../helpers/ErrorHandler";
import { hashString } from "../../helpers/hashString";
import { Request, Response } from "express";

export default class RestorePasswordController {
  constructor(
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler
  ) {}
  async run(req: Request, res: Response) {
    try {
      const { password } = req.body;
      const { id_user } = req.params;

      const user_found = await this.userRepository.find(id_user);

      const password_hash = await hashString(password);

      await this.userRepository.updateData(user_found.id_user, {
        password: password_hash,
      });
      return res.sendStatus(204);
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
