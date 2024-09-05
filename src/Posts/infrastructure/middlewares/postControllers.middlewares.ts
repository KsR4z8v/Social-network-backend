import { type NextFunction, type Request, type Response } from "express";
import ErrorHandler from "../../../Default/helpers/ErrorHandler";
import IncorrectDataRequest from "../../../Default/domain/exceptions/IncorrectDataRequest";
import IncorrectDataFormat from "../../../Default/domain/exceptions/IncorrectDataFormat";
import FileImage from "../../../Default/domain/FileImage";
const errorHandler: ErrorHandler = new ErrorHandler();

export const middlewareCreatePost = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const size = Number(req.get("content-length") ?? 0);
    const files = req.files as Express.Multer.File[];
    const { text } = req.body;

    if (size > 15000000) {
      throw new IncorrectDataRequest("El contenido supera las 10Mb");
    }

    if (!files && !req.body.text) {
      throw new IncorrectDataRequest("Debes de subir una imagen o un texto");
    }
    const imagesToUpload: FileImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (
        !["image/png", "image/jpg", "image/jpeg", "video/mp4"].includes(
          file.mimetype,
        )
      ) {
        throw new IncorrectDataFormat("file", file.originalname);
      }

      imagesToUpload.push({
        buffer: file.buffer,
        format: file.mimetype,
        originalName: file.originalname,
        size: file.size,
      });
    }

    req.body = { text, imagesToUpload };

    next();
  } catch (e) {
    errorHandler.run(req, res, e);
  }
};
