import { Request, Response } from "express";
import codeGenerator from "../../helpers/code_generator";
import jwt from "jsonwebtoken";
import VerifyCodeRedisService from "../../database/redis/VerifyCodeRedisService";
import MongoUserRepository from "../../database/repositories/MongoUserRepository";
import ErrorHandler from "../../helpers/ErrorHandler";
import AccountDeactivated from "../../exceptions/AccountDeactivated";
import ApiGoogleEmailService from "../../services/sendEmailGoogle.service";

export default class SendEmailController {
  constructor(
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler
  ) {}
  async run(req: Request, res: Response) {
    try {
      const { type } = req.query;

      const { user } = req.body;

      const user_found = await this.userRepository.find(user);

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
        ApiGoogleEmailService.getInstance().sendVerificationCode(
          user_found.email,
          user_fullname,
          verify_Code
        );
      }
      if (type === "recoveryPassword") {
        const token = jwt.sign(
          { id_user: user_found.id_user },
          process.env.KEY_SECRET_JWT || "secret",
          { expiresIn: "1h" }
        );
        ApiGoogleEmailService.getInstance().sendVerificationCode(
          user_found.email,
          user_fullname,
          token
        );
      }
      res.sendStatus(204);
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
