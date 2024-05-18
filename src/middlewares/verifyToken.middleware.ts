// import jwt from "jsonwebtoken";
import { type Request, type Response, type NextFunction } from "express";
import ErrorHandler from "../helpers/ErrorHandler";
const errorHandler: ErrorHandler = new ErrorHandler();

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    /*     const { headers } = req;
    const csrfToken = headers.authorization?.split("Bearer ")[1];

    if (!csrfToken) {
      return res.status(401).json({ message: "csrfToken not found" });
    }

    jwt.verify(csrfToken, process.env.KEY_SECRET_JWT || "secret"); */

    next();
  } catch (e) {
    errorHandler.run(req, res, e);
  }
};

export default verifyToken;
