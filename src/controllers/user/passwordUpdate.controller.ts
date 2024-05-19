/* eslint-disable @typescript-eslint/naming-convention */
import { type Request, type Response } from "express";
import { hashString } from "../../helpers/hashString";
import bcrypt from "bcryptjs";
import type MongoUserRepository from "../../database/repositories/MongoUserRepository";
import type ErrorHandler from "../../helpers/ErrorHandler";
import PasswordIncorrect from "../../exceptions/PasswordIncorrect";

export default class PasswordUpdateController {
  constructor(
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { id_user } = req.params;
      const { old_password, new_password } = req.body;

      const userFound = await this.userRepository.find(id_user);

      if (!(await bcrypt.compare(old_password as string, userFound.password))) {
        throw new PasswordIncorrect();
      }
      const password_new_hash = await hashString(new_password as string);

      if (await bcrypt.compare(old_password as string, password_new_hash)) {
        return res.status(411).json({
          message: "Las contraseñas son iguales",
        });
      }
      await this.userRepository.updateData(id_user.toString(), {
        password: password_new_hash,
      });
      res.status(200).json({ state: "ok", data: { id_user } });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
