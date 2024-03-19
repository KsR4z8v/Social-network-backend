import { Request, Response } from "express";
import codeGenerator from "../../helpers/code_generator";
import sendEmail from "../../services/sendEmailGoogle.service";
import jwt from "jsonwebtoken";
import VerifyCodeRedisService from "../../database/redis/VerifyCodeRedisService";
import MongoUserRepository from "../../database/repositories/MongoUserRepository";
import ErrorHandler from "../../helpers/ErrorHandler";
import UserNotExist from "../../exceptions/UserNotExist";
import AccountDeactivated from "../../exceptions/AccountDeactivated";

export default class SendEmailController {
  constructor(
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler
  ) {}
  async run(req: Request, res: Response) {
    try {
      const { type } = req.query;

      const { id_user, email } = req.body;

      const user_found = await this.userRepository.find({ id_user, email });

      if (!user_found) {
        throw new UserNotExist();
      }
      if (!user_found.account_settings.state_account) {
        throw new AccountDeactivated();
      }
      const user_fullname = user_found.fullname.split(" ")[0];
      if (type === "verifyAccount") {
        const serviceRedis = VerifyCodeRedisService.getInstance();
        const verify_Code = codeGenerator(4);
        await serviceRedis.setVerificationCode(
          user_found._id.toString(),
          verify_Code
        );
        sendEmail(user_found.email, user_fullname).verificationEmail(
          verify_Code
        );
      }
      if (type === "recoveryPassword") {
        const authorization = jwt.sign(
          { code: codeGenerator(10) },
          process.env.RESTORE_KEY_PASSWORD || "secret",
          { expiresIn: "10m" }
        );
        const token = jwt.sign(
          { id_user: user_found.id_user, authorization },
          process.env.KEY_SECRET_JWT || "secret",
          { expiresIn: "1h" }
        );
        sendEmail(user_found.email, user_fullname).resetPasswordLink(token);
      }
      res.sendStatus(204);
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
