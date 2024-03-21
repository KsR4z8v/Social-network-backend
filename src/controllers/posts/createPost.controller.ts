import dotenv from "dotenv";
import { upload_Media } from "../../services/imageKit.service";
import { Request, Response } from "express";
import MongoPostRepository from "../../database/repositories/MongoPostRepository";
import MongoUserRepository from "../../database/repositories/MongoUserRepository";
import ErrorHandler from "../../helpers/ErrorHandler";
import UserNotExist from "../../exceptions/UserNotExist";
import AccountDeactivated from "../../exceptions/AccountDeactivated";

dotenv.config();

export default class CreatePostController {
  constructor(
    readonly postRepository: MongoPostRepository,
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler
  ) {}

  async run(req: Request, res: Response) {
    try {
      const { id_user } = req.params;
      const media: any = req.files;
      const { text } = req.body;

      const user_found = await this.userRepository.find(id_user);

      if (!user_found.account_settings.state_account) {
        throw new AccountDeactivated();
      }

      let media_saved = media
        ? await upload_Media(media, process.env.MEDIA_FOLDER_DEST || " ")
        : []; //insert images on image kit

      await this.postRepository.create(id_user, text, media_saved);

      res.sendStatus(204);
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
