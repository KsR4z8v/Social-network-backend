import { Request, Response } from "express";
import codeGenerator from "../../helpers/code_generator";
import { hashString } from "../../helpers/encrypt";
import VerifyCodeRedisService from "../../database/redis/VerifyCodeRedisService";
import sendEmail from "../../services/sendEmailGoogle.service";
import MongoUserRepository from "../../database/repositories/MongoUserRepository";
import ErrorHandler from "../../helpers/ErrorHandler";
import DataAlreadyExist from "../../exceptions/DataAlreadyExist";

export default class SignUpController {
  constructor(
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler
  ) {
    this.userRepository = userRepository;
  }
  async run(req: Request, res: Response) {
    try {
      let { username, email, password, fullname, phone_number, date_born } =
        req.body;

      const user_found = await this.userRepository.exist({
        email,
        username,
      });

      if (user_found) {
        throw new DataAlreadyExist(
          user_found.username === username ? "username" : "correo"
        );
      }
      const verifyCode = codeGenerator(4);

      const password_encrypt = await hashString(password);

      const insertedId = await this.userRepository.create(
        username,
        email,
        fullname,
        password_encrypt,
        date_born,
        process.env.AVATAR_DEFAULT || "",
        phone_number
      );
      const serviceRedis = VerifyCodeRedisService.getInstance();
      await serviceRedis.setVerificationCode(insertedId, verifyCode);

      sendEmail(email, fullname.split(" ")[0]).verificationEmail(verifyCode);
      res.status(200).json({ data: { id_user: insertedId }, state: "ok" });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
