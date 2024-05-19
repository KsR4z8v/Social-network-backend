/* eslint-disable @typescript-eslint/naming-convention */
import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import VerifyCodeRedisService from "../../database/redis/VerifyCodeRedisService";
import config from "../../configs/config";
import type MongoUserRepository from "../../database/repositories/MongoUserRepository";
import type ErrorHandler from "../../helpers/ErrorHandler";
import VerificationCodeExpired from "../../exceptions/VerificationCodeExpired";
import VerificationCodeIncorrect from "../../exceptions/VerificationCodeIncorrect";

export default class ConfirmEmailController {
  constructor(
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { id_user } = req.params;
      const { entered_code } = req.body;
      const userFound = await this.userRepository.find(id_user);

      const redisService = VerifyCodeRedisService.getInstance();
      const verificationCode = await redisService.getVerificationCode(
        userFound._id.toString(),
      );

      if (!verificationCode) {
        throw new VerificationCodeExpired();
      }
      if (verificationCode !== entered_code) {
        throw new VerificationCodeIncorrect();
      }
      await redisService.deleteVerificationCode(id_user.toString());
      await this.userRepository.updateSettings(id_user, {
        verified_email: true,
      });

      const tkn = jwt.sign(
        { sessionId: req.session.id, id_user: userFound._id },
        process.env.KEY_SECRET_JWT ?? "secret",
        config.config_token,
      );

      return res.status(200).json({
        data: { id_user, csrftoken: tkn },
        state: "ok",
      });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
