import { Request, Response } from "express";
import MongoUserRepository from "../../../database/repositories/MongoUserRepository";
import ErrorHandler from "../../../helpers/ErrorHandler";

export default class DeleteRelationController {
  constructor(
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler
  ) {}
  async run(req: Request, res: Response) {
    const { id_user, id_relation } = req.params;

    try {
      const { type } = req.query;
      if (type === "request") {
        await this.userRepository.deleteRequest(id_user, id_relation);
      } else {
        await this.userRepository.deleteFriend(id_user, id_relation);
      }
      return res.sendStatus(204);
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
