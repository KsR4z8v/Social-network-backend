import type ErrorHandler from "../../../Default/helpers/ErrorHandler";
import { type Request, type Response } from "express";
import ObtainPostCase from "../../application/ObtainPostCase";
import { ObjectId } from "mongodb";

export default class ObtainPostController {
  constructor(
    readonly obtainPostCase: ObtainPostCase,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<any> {
    try {
      const userId: string = "";

      const criteria = new Map<string, unknown>([]);

      const keys = Object.keys(req.query);

      for (let i = 0; i < keys.length; i++) {
        criteria.set(keys[i], req.query[keys[i]]);
      }

      const posts = await this.obtainPostCase.run(userId, criteria);

      const nextCursor: number =
        posts.length > 0
          ? posts[posts.length - 1].createdAt.getTime()
          : new Date().getTime();

      return res.status(200).json({
        state: "ok",
        data: {
          posts,
          cursor: nextCursor,
        },
      });
    } catch (error) {
      this.errorHandler.run(req, res, error);
    }
  }
}
