/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import dotenv from "dotenv";
import { uploadMediaV2 } from "../../services/imageKit.service";
import { type Request, type Response } from "express";
import type MongoPostRepository from "../../database/repositories/MongoPostRepository";
import type MongoUserRepository from "../../database/repositories/MongoUserRepository";
import type ErrorHandler from "../../helpers/ErrorHandler";
import AccountDeactivated from "../../exceptions/AccountDeactivated";

dotenv.config();

export default class CreatePostController {
  constructor(
    readonly postRepository: MongoPostRepository,
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { id_user } = req.params;
      const media = req.files as any;
      const { text } = req.body;

      const userFound = await this.userRepository.find(id_user);

      if (!userFound.account_settings.state_account) {
        throw new AccountDeactivated();
      }

      const mediaSaved = media
        ? await uploadMediaV2(
            media as any[],
            process.env.MEDIA_FOLDER_DEST_TEST ?? " ",
          )
        : []; // insert images on image kit

      await this.postRepository.create(id_user, text as string, mediaSaved);

      return res.sendStatus(204);
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
