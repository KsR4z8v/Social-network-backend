import { JwtPayload, verify } from "jsonwebtoken";
import { type Request, type Response, type NextFunction } from "express";
import ErrorHandler from "../../../Default/helpers/ErrorHandler";
import SessionRequired from "../../../Default/domain/exceptions/SessionRequired";

const errorHandler: ErrorHandler = new ErrorHandler();

const cookieParser = (data: string) => {
  const output: Record<string, string> = {};
  const values = data.split(" ");
  for (let i = 0; i < values.length; i++) {
    const pair = values[i].split("=");
    output[String(pair[0])] = String(pair[1]);
  }
  return output;
};

const verifySession = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response | undefined => {
  try {
    // obtain tokens
    const bearerToken: string | undefined =
      req.headers.authorization?.split("Bearer ")[1];

    const cookieToken: string | undefined = cookieParser(
      req.headers.cookie ?? "",
    )["tkn"];

    const token: string | undefined = cookieToken ?? bearerToken;

    if (!token && !req.session.user) {
      throw new SessionRequired();
    }

    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }

    const data: JwtPayload = verify(
      token,
      process.env.SECRET_KEY_TOKEN ?? "",
    ) as JwtPayload;

    if (req.session.user) {
      if (token !== req.session.user.authToken) {
        return res.status(401).json({ message: "Token corrupted" });
      }
    } else {
      req.session.user = {
        userId: data.userId,
        authToken: token,
        restoreToken: null,
        role: "user",
        username: "",
      };
    }
    /*   console.log({
      bearerToken,
      cookieToken,
    }); */
    next();
  } catch (e) {
    errorHandler.run(req, res, e);
  }
};

export default verifySession;
