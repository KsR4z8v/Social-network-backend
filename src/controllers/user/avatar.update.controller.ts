import backOff from "../../helpers/backOff";
import { upload_Media, delete_Media } from "../../services/imageKit.service";
import { Request, Response } from "express";
import MongoUserRepository from "../../database/repositories/MongoUserRepository";
import ErrorHandler from "../../helpers/ErrorHandler";
import UserNotExist from "../../exceptions/UserNotExist";

export default class avatarUpdateController {
  constructor(
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler
  ) {}
  async run(req: Request, res: Response) {
    try {
      const { id_user } = req.params;

      const avatar: Express.Multer.File | undefined = req.file;

      const user_found = await this.userRepository.find(id_user);

      if (user_found.avatar.id_kit) {
        delete_Media([user_found.avatar.id_kit]);
      }
      const meta_data = await upload_Media(
        avatar ? [avatar] : [],
        process.env.AVATARS_FOLDER_DEST || ""
      );

      backOff(
        async () => {
          await this.userRepository.updateAvatar(id_user, {
            url: meta_data[0].url,
            id_kit: meta_data[0].id_kit,
          });
        },
        {
          increment: "exp",
        }
      );
      return res.sendStatus(204);
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
