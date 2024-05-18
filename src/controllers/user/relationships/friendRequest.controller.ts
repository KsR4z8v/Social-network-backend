/* eslint-disable @typescript-eslint/naming-convention */
import { type Request, type Response } from "express";
import type MongoUserRepository from "../../../database/repositories/MongoUserRepository";
import type ErrorHandler from "../../../helpers/ErrorHandler";
import IncorrectDataRequest from "../../../exceptions/IncorrectDataRequest";

export default class FriendRequestController {
  constructor(
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    const { id_user, to_user } = req.params;

    try {
      if (id_user === to_user) {
        throw new IncorrectDataRequest(
          "No te puedes enviar solicitud a ti mismo",
        );
      }
      const resp_db = await this.userRepository.sendFriendRequest(
        id_user,
        to_user,
      );

      return res.status(200).json({
        state: "ok",
        data: resp_db,
      });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
