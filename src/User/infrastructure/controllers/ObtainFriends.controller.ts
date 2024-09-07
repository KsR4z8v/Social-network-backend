import { type Request, type Response } from "express";
import type ErrorHandler from "../../../Default/helpers/ErrorHandler";
import type ObtainFriendsCase from "../../application/ObtainFriendsCase";
import { equal } from "assert";

export default class ObtainFriendsController {
  constructor(
    readonly obtainFriendsCase: ObtainFriendsCase,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { user } = req.params;

      const { page } = req.query;

      const selfUserId = req.session.user?.userId;

      const pageNumber: number = !Number.isNaN(Number(page)) ? Number(page) : 1;

      const friends = await this.obtainFriendsCase.run(
        user,
        selfUserId,
        pageNumber,
      );

      return res.status(200).json({ state: "ok", data: { friends } });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
