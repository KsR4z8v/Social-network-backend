import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../helpers/ErrorHandler";
import IncorrectDataRequest from "../exceptions/IncorrectDataRequest";
import IncorrectDataFormat from "../exceptions/IncorrectDataFormat";
const errorHandler: ErrorHandler = new ErrorHandler();
export const middleware_CreatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const size = parseInt(req.get("content-length") as string);
    const data: any = req.files;

    if (size > 15000000) {
      throw new IncorrectDataRequest("El contenido supera las 10Mb");
    }

    if (!data && !req.body.text) {
      throw new IncorrectDataRequest("Debes de subir una imagen o un texto");
    }

    for (let i in data) {
      if (
        !["image/png", "image/jpg", "image/jpeg", "video/mp4"].includes(
          data[i].mimetype
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
