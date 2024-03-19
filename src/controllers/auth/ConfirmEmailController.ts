import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import VerifyCodeRedisService from "../../database/redis/VerifyCodeRedisService";
import config from "../../configs/config";
import MongoUserRepository from "../../database/repositories/MongoUserRepository";
import ErrorHandler from "../../helpers/ErrorHandler";
import UserNotExist from "../../exceptions/UserNotExist";
import VerificationCodeExpired from "../../exceptions/VerificationCodeExpired";
import VerificationCodeIncorrect from "../../exceptions/VerificationCodeIncorrect";

export default class ConfirmEmailController {
  constructor(
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler
  ) {}
  async run(req: Request, res: Response) {
    try {
      const { id_user } = req.params;
      const { entered_code } = req.body;
      const user_found = await this.userRepository.find({ id_user });

      if (!user_found) {
        throw new UserNotExist(id_user);
      }
      const redis_service = VerifyCodeRedisService.getInstance();
      const code_get = await redis_service.getVerificationCode(
        id_user.toString()
      );

      if (!code_get) {
        throw new VerificationCodeExpired();
      }
      if (code_get != entered_code) {
        throw new VerificationCodeIncorrect();
      }
      await redis_service.deleteVerificationCode(id_user.toString());
      await this.userRepository.updateSettings(id_user, {
        verified_email: true,
      });

      const tkn = jwt.sign(
        { sessionId: req.session.id, id_user: user_found._id },
        process.env.KEY_SECRET_JWT || "secret",
        config.config_token
      );

      res.status(200).json({
        data: { id_user, csrftoken: tkn },
        state: "ok",
      });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
