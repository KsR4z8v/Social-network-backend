/* eslint-disable @typescript-eslint/naming-convention */
import validationTokenGoogle from "../../helpers/validationTokenGoogle";
import generateCode from "../../helpers/generateVerificationCode";
import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { generateDateToRegister } from "../../helpers/dateFunctions";
import config from "../../configs/config";
import type MongoUserRepository from "../../database/repositories/MongoUserRepository";
import type ErrorHandler from "../../helpers/ErrorHandler";
import AccountDeactivated from "../../exceptions/AccountDeactivated";
import { hashString } from "../../helpers/hashString";
export default class AuthGooglePlatformController {
  constructor(
    readonly userRepository: MongoUserRepository,
    readonly errorHandler: ErrorHandler
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { credentials } = req.body;
      const { picture, name, given_name, email } = await validationTokenGoogle(
        credentials.credential as string
      );

      const userFound = await this.userRepository.exist({
        // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
        email: email as string,
      });

      let idUser: string | undefined = userFound?.id;

      if (!userFound) {
        const password = await hashString(generateCode(10));

        const insertedId = await this.userRepository.create(
          given_name ?? " ",
          email ?? " ",
          name ?? " ",
          password,
          generateDateToRegister(),
          picture ?? " ",
          " "
        );
        await this.userRepository.updateData(insertedId, {
          "account_settings.verified_email": true,
        });
        idUser = insertedId;
      }
      if (userFound && !userFound.account_settings.state_account) {
        throw new AccountDeactivated();
      }

      const tkn = jwt.sign(
        { sessionId: req.session.id, idUser },
        process.env.KEY_SECRET_JWT ?? "secret",
        config.CONFIG_TOKEN
      );

      return res.status(200).json({
        state: "ok",
        data: {
          csrftoken: tkn,
          id_user: idUser,
        },
      });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
