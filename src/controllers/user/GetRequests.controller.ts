import { Request, Response } from "express";
import MongoUserRepository from "../../database/repositories/MongoUserRepository";
import ErrorHandler from "../../helpers/ErrorHandler";
import getDataToken from "../../helpers/getDataToken";

export default class GetRequestsController {
  constructor(
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler
  ) {}
  async run(req: Request, res: Response) {
    try {
      const { user, type } = req.params;
      const { page } = req.query;
      const { payload } = getDataToken(req);
      const id_user_tk = payload.id_user;

      const user_found = await this.userRepository.find(user);

      if (user_found._id.toString() !== id_user_tk) {
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
      const requests_found = await this.userRepository.getRelationFields(
        user,
        fields[type],
        user_found._id.toString(),
        parseInt(page as string)
      );

      return res
        .status(200)
        .json({ state: "ok", data: { requests: requests_found } });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
