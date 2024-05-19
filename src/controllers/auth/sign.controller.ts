import { type Request, type Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import codeGenerator from "../../helpers/code_generator";
import VerifyCodeRedisService from "../../database/redis/VerifyCodeRedisService";
import config from "../../configs/config";
import type MongoUserRepository from "../../database/repositories/MongoUserRepository";
import type ErrorHandler from "../../helpers/ErrorHandler";
import PasswordIncorrect from "../../exceptions/PasswordIncorrect";
import AccountDeactivated from "../../exceptions/AccountDeactivated";
import ApiGoogleEmailService from "../../services/sendEmailGoogle.service";
import { compare } from "bcryptjs";

dotenv.config();

export default class SignController {
  constructor(
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler,
  ) {
    this.userRepository = userRepository;
  }

  async run(req: Request, res: Response): Promise<Response | undefined> {
    const { user, password } = req.body;
    try {
      const userFound = await this.userRepository.find(user as string);

      if (!userFound.account_settings.state_account) {
        throw new AccountDeactivated();
      }
      const passValidation: boolean = await compare(
        password as string,
        userFound.password,
      );
      if (!passValidation) {
        throw new PasswordIncorrect();
      }
      if (!userFound.account_settings.verified_email) {
        const serviceRedis: VerifyCodeRedisService =
          VerifyCodeRedisService.getInstance();
        const verifyCode = codeGenerator(4);
        await serviceRedis.setVerificationCode(
          userFound._id.toString(),
          verifyCode,
        );
        void ApiGoogleEmailService.getInstance().sendVerificationCode(
          userFound.email,
          userFound.fullname,
          verifyCode,
        );
        return res.status(200).json({
          state: "PENDING_TO_VERIFIED",
          data: {
            id_user: userFound._id,
            fullname: userFound.fullname,
          },
        });
      }
      const tkn = jwt.sign(
        { sessionId: req.session.id, idUser: userFound._id },
        process.env.KEY_SECRET_JWT ?? "secret",
        config.config_token,
      );
      /*     req.session.id_user = user_found.id_user;
    req.session.role = user_found.role;
    req.session.tkn = tkn; */
      return res.status(200).json({
        state: "ok",
        data: {
          csrftoken: tkn,
          id_user: userFound._id,
          username: userFound.username,
          email: userFound.email,
        },
      });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
