import { Request, Response } from "express";
import MongoUserRepository from "../../database/repositories/MongoUserRepository";
import ErrorHandler from "../../helpers/ErrorHandler";

export default class DataUpdateController {
  constructor(
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler
  ) {}
  async run(req: Request, res: Response) {
    try {
      const { id_user } = req.params;
      const { data } = req.query;

      if (data === "config") {
        await this.userRepository.updateSettings(id_user, {
          ...req.body,
        });
      } else {
        await this.userRepository.updateData(id_user, {
          ...req.body,
        });
      }

      return res.status(200).json({ state: "ok", data: { id_user } });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
