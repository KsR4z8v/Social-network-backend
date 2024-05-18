import { type Request, type Response } from "express";
import codeGenerator from "../../helpers/code_generator";
import jwt from "jsonwebtoken";
import VerifyCodeRedisService from "../../database/redis/VerifyCodeRedisService";
import type MongoUserRepository from "../../database/repositories/MongoUserRepository";
import type ErrorHandler from "../../helpers/ErrorHandler";
import AccountDeactivated from "../../exceptions/AccountDeactivated";
import ApiGoogleEmailService from "../../services/sendEmailGoogle.service";

export default class SendEmailController {
  constructor(
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { type } = req.query;
      const { user } = req.body;

      const userFound = await this.userRepository.find(user as string);

      if (!userFound.accountSettings.state_account) {
        throw new AccountDeactivated();
      }
      const userFullname = userFound.fullname.split(" ")[0];

      if (type === "verifyAccount") {
        const serviceRedis = VerifyCodeRedisService.getInstance();
        const verifyCode = codeGenerator(4);
        void serviceRedis.setVerificationCode(userFound.id, verifyCode);

        void ApiGoogleEmailService.getInstance().sendVerificationCode(
          userFound.email,
          userFullname,
          verifyCode,
        );
      }
      if (type === "recoveryPassword") {
        const token = jwt.sign(
          { id_user: userFound.id },
          process.env.KEY_SECRET_JWT ?? "secret",
          { expiresIn: "5m" },
        );
        void ApiGoogleEmailService.getInstance().sendVerificationCode(
          userFound.email,
          userFullname,
          token,
        );
      }
      return res.sendStatus(204);
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
