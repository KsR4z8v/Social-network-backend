/* eslint-disable @typescript-eslint/naming-convention */
import backOff from "../../helpers/backOff";
import { uploadMedia, deleteMedia } from "../../services/imageKit.service";
import { type Request, type Response } from "express";
import type MongoUserRepository from "../../database/repositories/MongoUserRepository";
import type ErrorHandler from "../../helpers/ErrorHandler";

export default class avatarUpdateController {
  constructor(
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { id_user } = req.params;

      const avatar: Express.Multer.File | undefined = req.file;

      const userFound = await this.userRepository.find(id_user);

      if (userFound.avatar.id_kit) {
        void deleteMedia([userFound.avatar.id_kit]);
      }
      const meta_data = await uploadMedia(
        avatar ? [avatar] : [],
        process.env.AVATARS_FOLDER_DEST ?? "",
      );

      void backOff(async () => {
        await this.userRepository.updateAvatar(id_user, {
          url: meta_data[0].url,
          id_kit: meta_data[0].id_kit,
        });
      }, "exp");
      return res.sendStatus(204);
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
