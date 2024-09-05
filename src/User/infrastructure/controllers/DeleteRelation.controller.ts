/* eslint-disable @typescript-eslint/naming-convention */
import { type Request, type Response } from "express";

import type ErrorHandler from "../../../Default/helpers/ErrorHandler";
import type DeleteRelationCase from "../../application/DeleteRelationCase";

export default class DeleteRelationController {
  constructor(
    readonly deleteRelationCase: DeleteRelationCase,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    const { userId, relationId } = req.params;
    try {
      const { type } = req.query;
      await this.deleteRelationCase.run(userId, relationId, String(type));
      return res.sendStatus(204);
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
