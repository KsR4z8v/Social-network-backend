import { type Response, type Request } from "express";
import ExceptionServer from "../exceptions/ExceptionServer";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

interface errorResponse {
  state: string | "error";
  httpCode: number;
  error: {
    type: string;
    code: number;
    message: string;
  };
}

const createResponse = (
  state: string | "error",
  httpCode: number | 500,
  type: string,
  code: number,
  message: string,
): errorResponse => {
  return {
    state,
    httpCode,
    error: {
      type,
      code,
      message,
    },
  };
};

export default class ErrorHandler {
  run(req: Request, res: Response, error: unknown): unknown {
    const defaultResponse: errorResponse = {
      state: "error",
      httpCode: 500,
      error: {
        type: "INTERNAL_SERVER_ERROR",
        code: 101,
        message: "Internal server error",
      },
    };
    if (error instanceof TokenExpiredError) {
      const r_: errorResponse = createResponse(
        "error",
        401,
        "TOKEN_EXPIRED",
        602,
        "token is expired",
      );
      return res.status(r_.httpCode).json(r_);
    }
    if (error instanceof JsonWebTokenError) {
      const r_: errorResponse = createResponse(
        "error",
        401,
        "TOKEN_INVALID",
        601,
        "token is invalid",
      );
      return res.status(r_.httpCode).json(r_);
    }

    if (error instanceof ExceptionServer) {
      const r_: errorResponse = createResponse(
        "error",
        error.httpCode,
        error.type,
        error.code,
        error.message,
      );
      return res.status(r_.httpCode).json(r_);
    }
    console.log(error);
    return res.status(defaultResponse.httpCode).json(defaultResponse);
  }
}
