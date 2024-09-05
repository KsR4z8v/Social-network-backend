import { type Request, type Response } from "express";
import type ErrorHandler from "../../../Default/helpers/ErrorHandler";
import type ObtainRequestsCase from "../../application/ObtainRequests";
import UnauthorizedAction from "../../../Default/domain/exceptions/UnauthorizedAction";

export default class ObtainRequestsController {
  constructor(
    readonly obtainRequestsCase: ObtainRequestsCase,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { userId } = req.params;

      if (userId !== req.session.user?.userId) {
        throw new UnauthorizedAction();
      }

      const requestsReceivedFound = await this.obtainRequestsCase.run(userId);

      return res
        .status(200)
        .json({ state: "ok", data: { requests: requestsReceivedFound } });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
