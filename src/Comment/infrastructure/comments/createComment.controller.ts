/* eslint-disable @typescript-eslint/naming-convention */
import { type Request, type Response } from "express";
import type MongoPostRepository from "../../../Posts/infrastructure/repositories/MongoPostRepository";
import type MongoUserRepository from "../../database/repositories/MongoUserRepository";
import type ErrorHandler from "../../../Default/helpers/ErrorHandler";
import AccountDeactivated from "../../../Default/domain/exceptions/AccountDeactivated";

export default class CreateCommentController {
  constructor(
    readonly postRepository: MongoPostRepository,
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { id_post, id_user } = req.params;

      const { text } = req.body;

      const userFound = await this.userRepository.find(id_user);

      if (!userFound.account_settings.state_account) {
        throw new AccountDeactivated();
      }
      // TODO verificar permisos del usuario

      const insertedId: string = await this.postRepository.comment(
        id_user,
        text as string,
        id_post,
      );

      return res.status(201).json({
        state: "ok",
        data: {
          user: id_user,
          id_comment: insertedId,
          text,
        },
      });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
