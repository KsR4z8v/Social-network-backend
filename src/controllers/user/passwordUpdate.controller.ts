import { Request, Response } from "express";
import { hashString } from "../../helpers/hashString";
import bcrypt from "bcryptjs";
import MongoUserRepository from "../../database/repositories/MongoUserRepository";
import ErrorHandler from "../../helpers/ErrorHandler";
import PasswordIncorrect from "../../exceptions/PasswordIncorrect";

export default class PasswordUpdateController {
  constructor(
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler
  ) {}
  async run(req: Request, res: Response) {
    try {
      const { id_user } = req.params;
      const { old_password, new_password } = req.body;

      const user_found = await this.userRepository.find(id_user);

      if (!(await bcrypt.compare(old_password, user_found.password))) {
        throw new PasswordIncorrect();
      }
      const password_new_hash = await hashString(new_password);

      if (await bcrypt.compare(old_password, password_new_hash)) {
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
