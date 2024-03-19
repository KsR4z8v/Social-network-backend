import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../helpers/ErrorHandler";
const errorHandler: ErrorHandler = new ErrorHandler();

const verify_token = (req: Request, res: Response, next: NextFunction) => {
  next();
  return;
  /*   try {
    const { session, headers } = req;
    //const { tkn } = session
    const csrfToken = headers.authorization?.split("Bearer ")[1];
    //console.log(headers.authorization);
    //console.log(csrfToken);
    //        if (!tkn) {
    //                return resp.status(403).json({ message: 'Para realizar esta accion debes de iniciar sesion...' })
    //            }

    if (!csrfToken) {
      return res.status(401).json({ message: "csrfToken not found" });
    }

    //         if (tkn !== csrfToken) {
    //               return resp.status(403).json({ message: 'What are you trying to do rat?' })
    //           }

    const data_tkn: JwtPayload | null | string = jwt.decode(csrfToken);
    //
    //          if (session.id !== data_tkn.sessionId) {
    //              return resp.status(403).json({ message: 'this is not your session, get out here rat!! ' })
    //          }

    jwt.verify(csrfToken, process.env.KEY_SECRET_JWT || "secret");

    next();
  } catch (e) {
    return errorHandler(req,res,e)
  } */
};

export default verify_token;
