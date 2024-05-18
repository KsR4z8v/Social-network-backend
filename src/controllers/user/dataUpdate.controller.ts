/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/naming-convention */
import { type Request, type Response } from "express";
import type MongoUserRepository from "../../database/repositories/MongoUserRepository";
import type ErrorHandler from "../../helpers/ErrorHandler";

export default class DataUpdateController {
  constructor(
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
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
