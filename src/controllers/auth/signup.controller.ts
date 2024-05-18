/* eslint-disable @typescript-eslint/naming-convention */
import { type Request, type Response } from "express";
import codeGenerator from "../../helpers/code_generator";
import { hashString } from "../../helpers/hashString";
import VerifyCodeRedisService from "../../database/redis/VerifyCodeRedisService";
import type MongoUserRepository from "../../database/repositories/MongoUserRepository";
import type ErrorHandler from "../../helpers/ErrorHandler";
import DataAlreadyExist from "../../exceptions/DataAlreadyExist";
import ApiGoogleEmailService from "../../services/sendEmailGoogle.service";

export default class SignUpController {
  constructor(
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler,
  ) {
    this.userRepository = userRepository;
  }

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { username, email, password, fullname, phone_number, date_born } =
        req.body;

      const userFound = await this.userRepository.exist({
        email,
        username,
      });

      if (userFound) {
        throw new DataAlreadyExist(
          userFound.username === username ? "nombre de usuario" : "correo",
        );
      }
      const verifyCode = codeGenerator(4);

      const password_encrypt = await hashString(password as string);

      const insertedId = await this.userRepository.create(
        username as string,
        email as string,
        fullname as string,
        password_encrypt,
        date_born as Date,
        process.env.AVATAR_DEFAULT ?? "",
        phone_number as string,
      );
      const serviceRedis = VerifyCodeRedisService.getInstance();
      await serviceRedis.setVerificationCode(insertedId, verifyCode);

      void ApiGoogleEmailService.getInstance().sendVerificationCode(
        email as string,
        username as string,
        verifyCode,
      );
      return res
        .status(200)
        .json({ data: { id_user: insertedId }, state: "ok" });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
