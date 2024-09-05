/* eslint-disable @typescript-eslint/naming-convention */
import { type Request, type Response } from "express";
import type ErrorHandler from "../../../Default/helpers/ErrorHandler";
import type createUserCase from "../../application/CreateUserCase";
import UserCreate from "../../domain/UserCreate";

export default class CreateUserController {
  constructor(
    readonly createUserCase: createUserCase,
    readonly errorHandler: ErrorHandler
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { username, email, fullname, password, dateBorn } = req.body;
      const avatarUrlDefault: string | undefined = process.env.AVATAR_DEFAULT;
      if (!avatarUrlDefault) {
        throw new Error("The url default variable is missing");
      }
      const user: UserCreate = new UserCreate(
        username as string,
        email as string,
        { url: avatarUrlDefault, externalId: null },
        fullname as string,
        password as string,
        new Date(dateBorn as string),
        req.get("user-agent") ?? null,
        req.ip ?? null
      );

      const insertedId: string = await this.createUserCase.run(user);

      return res
        .status(200)
        .json({ data: { userId: insertedId }, state: "ok" });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
