/* eslint-disable @typescript-eslint/naming-convention */
import type MongoUserRepository from "../../database/repositories/MongoUserRepository";
import type ErrorHandler from "../../helpers/ErrorHandler";
import { hashString } from "../../helpers/hashString";
import { type Request, type Response } from "express";

export default class RestorePasswordController {
  constructor(
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { password } = req.body;
      const { id_user } = req.params;

      const userFound = await this.userRepository.find(id_user);

      const passwordHash: string = await hashString(password as string);

      await this.userRepository.updateData(userFound._id.toString(), {
        password: passwordHash,
      });
      return res.sendStatus(204);
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
