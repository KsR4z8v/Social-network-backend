/* eslint-disable @typescript-eslint/naming-convention */
import { type Request, type Response } from "express";
import type SendRequestCase from "../../application/SendRequestCase";
import type ErrorHandler from "../../../Default/helpers/ErrorHandler";
import IncorrectDataRequest from "../../../Default/domain/exceptions/IncorrectDataRequest";
import UnauthorizedAction from "../../../Default/domain/exceptions/UnauthorizedAction";

export default class SendRequestController {
  constructor(
    readonly sendRequestCase: SendRequestCase,
    readonly errorHandler: ErrorHandler,
  ) {}

  async run(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { submittedUserId, recipientUserId } = req.params;

      if (submittedUserId !== req.session.user?.userId) {
        throw new UnauthorizedAction();
      }

      if (submittedUserId === recipientUserId) {
        throw new IncorrectDataRequest(
          "No te puedes enviar solicitud a ti mismo",
        );
      }
      const option = await this.sendRequestCase.run(
        submittedUserId,
        recipientUserId,
      );

      return res.status(200).json({
        state: "ok",
        data: option,
      });
    } catch (e) {
      this.errorHandler.run(req, res, e);
    }
  }
}
