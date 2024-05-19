import { type Request, type Response } from "express";
import type MongoUserRepository from "../../database/repositories/MongoUserRepository";
import type ErrorHandler from "../../helpers/ErrorHandler";
import getDataToken from "../../helpers/getDataToken";

export default class GetRequestsController {
  constructor(
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { user, type } = req.params;
      const { page } = req.query;
      const { payload } = getDataToken(req);

      const idUserTk: string = payload.idUser;

      const userFound = await this.userRepository.find(user);

      if (userFound._id.toString() !== idUserTk) {
        return res.status(200).json({
          state: "ok",
          data: { friends: [] },
          message:
            "usted no tiene permisos suficientes para obtener el recurso",
        });
      }
      const fields: Record<string, "requests" | "my_requests_sent"> = {
        requests: "requests",
        reqsent: "my_requests_sent",
      };
      const requestsFound = await this.userRepository.getRelationFields(
        user,
        fields[type],
        userFound._id.toString(),
        parseInt(page as string),
      );

      return res
        .status(200)
        .json({ state: "ok", data: { requests: requestsFound } });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
