/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextFunction, type Request, type Response } from "express";
import ErrorHandler from "../helpers/ErrorHandler";
import IncorrectDataRequest from "../exceptions/IncorrectDataRequest";
import IncorrectDataFormat from "../exceptions/IncorrectDataFormat";
const errorHandler: ErrorHandler = new ErrorHandler();

export const middlewareCreatePost = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const size = parseInt(req.get("content-length") ?? "0");
    const data = req.files as Express.Multer.File[];

    if (size > 15000000) {
      throw new IncorrectDataRequest("El contenido supera las 10Mb");
    }

    if (!data && !req.body.text) {
      throw new IncorrectDataRequest("Debes de subir una imagen o un texto");
    }

    for (let i = 0; i < data.length; i++) {
      if (
        !["image/png", "image/jpg", "image/jpeg", "video/mp4"].includes(
          data[i].mimetype,
        )
      ) {
        throw new IncorrectDataFormat("file", data[i].originalname);
      }
    }

    next();
  } catch (e) {
    errorHandler.run(req, res, e);
  }
};
