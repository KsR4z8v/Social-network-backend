/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/naming-convention */
import { type Request, type Response } from "express";
import type ErrorHandler from "../../../Default/helpers/ErrorHandler";
import type UpdateUserCase from "../../application/UpdateUserCase";
import FileImage from "../../../Default/domain/FileImage";
import UnauthorizedAction from "../../../Default/domain/exceptions/UnauthorizedAction";

export default class UpdateUserController {
  constructor(
    readonly updateUserCase: UpdateUserCase,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { userId } = req.params;

      if (userId !== req.session.user?.userId) {
        throw new UnauthorizedAction();
      }

      const file: Express.Multer.File | undefined = req.file;

      let imageFile: FileImage | undefined;

      if (file) {
        imageFile = new FileImage(
          file.buffer,
          file.originalname,
          file.mimetype,
          file.size,
        );
      }

      const criteria: Map<string, unknown> = new Map<string, unknown>();
      const bodyKeys: string[] = Object.keys(req.body);
      for (let i = 0; i < bodyKeys.length; i++) {
        criteria.set(bodyKeys[i], req.body[bodyKeys[i]]);
      }

      await this.updateUserCase.run(userId, criteria, imageFile);
      return res.sendStatus(204);
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
