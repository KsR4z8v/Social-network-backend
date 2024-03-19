import validationTokenGoogle from "../../helpers/validationTokenGoogle";
import generateCode from "../../helpers/code_generator";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import encryptPassword from "../../helpers/encrypt";
import { generateDateToRegister } from "../../helpers/dateFunctions";
import TokenGoogleInvalid from "../../exceptions/TokenGoogleInvalid.exception";
import config from "../../configs/config";
import MongoUserRepository from "../../database/repositories/MongoUserRepository";
import ErrorHandler from "../../helpers/ErrorHandler";
import AccountDeactivated from "../../exceptions/AccountDeactivated";

export default class AuthGooglePlatformController {
  constructor(
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler
  ) {}
  async run(req: Request, res: Response) {
    try {
      const { credentials } = req.body;
      const { picture, name, given_name, email } = await validationTokenGoogle(
        credentials.credential
      );

      const user_found = await this.userRepository.find({
        email: email || " ",
      });

      let id_user: string = user_found?._id;

      if (!user_found) {
        const password = await encryptPassword(generateCode(10));

        const insertedId = await this.userRepository.create(
          given_name || " ",
          email || " ",
          name || " ",
          password,
          generateDateToRegister(),
          picture || " ",
          " "
        );
        id_user = insertedId;
      }
      if (user_found && !user_found.account_settings.state_account) {
        throw new AccountDeactivated();
      }

      const tkn = jwt.sign(
        { sessionId: req.session.id, id_user: user_found._id },
        process.env.KEY_SECRET_JWT || "secret",
        config.config_token
      );

      res.status(200).json({
        state: "ok",
        data: {
          csrftoken: tkn,
          id_user,
        },
      });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
