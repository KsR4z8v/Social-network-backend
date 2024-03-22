import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import codeGenerator from "../../helpers/code_generator";
import sendEmail from "../../services/sendEmailGoogle.service";
import VerifyCodeRedisService from "../../database/redis/VerifyCodeRedisService";
import config from "../../configs/config";
import MongoUserRepository from "../../database/repositories/MongoUserRepository";
import ErrorHandler from "../../helpers/ErrorHandler";
import PasswordIncorrect from "../../exceptions/PasswordIncorrect";
import AccountDeactivated from "../../exceptions/AccountDeactivated";

export default class SignController {
  constructor(
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler
  ) {
    this.userRepository = userRepository;
  }
  async run(req: Request, res: Response) {
    const { user, password } = req.body;
    try {
      const user_found = await this.userRepository.find(user);

      if (!user_found.account_settings.state_account) {
        throw new AccountDeactivated();
      }
      if (!(await bcrypt.compare(password, user_found.password))) {
        throw new PasswordIncorrect();
      }
      if (!user_found.account_settings.verified_email) {
        const serviceRedis: VerifyCodeRedisService =
          VerifyCodeRedisService.getInstance();
        const verify_Code = codeGenerator(4);
        await serviceRedis.setVerificationCode(
          user_found._id.toString(),
          verify_Code
        );
        sendEmail(
          user_found.email,
          user_found.fullname?.split(" ")[0]
        ).verificationEmail(verify_Code);
        return res.status(200).json({
          state: "PENDING_TO_VERIFIED",
          data: {
            id_user: user_found._id,
            fullname: user_found.fullname,
          },
        });
      }
      const tkn = jwt.sign(
        { sessionId: req.session.id, id_user: user_found._id },
        process.env.KEY_SECRET_JWT || "secret",
        config.config_token
      );
      /*     req.session.id_user = user_found.id_user;
    req.session.role = user_found.role;
    req.session.tkn = tkn; */
      return res.status(200).json({
        state: "ok",
        data: {
          csrftoken: tkn,
          id_user: user_found._id,
          username: user_found.username,
          email: user_found.email,
        },
      });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
