import { Request, Response } from "express";
import MongoPostRepository from "../../database/repositories/MongoPostRepository";
import MongoUserRepository from "../../database/repositories/MongoUserRepository";
import ErrorHandler from "../../helpers/ErrorHandler";
import AccountDeactivated from "../../exceptions/AccountDeactivated";
import UserNotExist from "../../exceptions/UserNotExist";

export default class CreateCommentController {
  constructor(
    readonly postRepository: MongoPostRepository,
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler
  ) {}
  async run(req: Request, res: Response) {
    try {
      const { id_post, id_user } = req.params;

      const { text } = req.body;

      const user_found = await this.userRepository.find({ id_user });
      if (!user_found) {
        throw new UserNotExist(id_user);
      }
      if (!user_found.account_settings.state_account) {
        throw new AccountDeactivated();
      }
      //TODO verificar permisos del usuario

      const comment_created: Record<string, any> =
        await this.postRepository.comment(id_user, text, id_post);

      return res.status(201).json({
        state: "ok",
        data: comment_created,
      });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
