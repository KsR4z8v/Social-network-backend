/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type Request, type Response, type NextFunction } from "express";
import { validateDateToRegister } from "../../../Default/helpers/dateFunctions";
import IncorrectDataRequest from "../../../Default/domain/exceptions/IncorrectDataRequest";
import ErrorHandler from "../../../Default/helpers/ErrorHandler";
import IncorrectDataFormat from "../../../Default/domain/exceptions/IncorrectDataFormat";

const errorHandler: ErrorHandler = new ErrorHandler();

export const middlewareSign = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const { user, password } = req.body;
    if (!user || !password) {
      throw new IncorrectDataRequest();
    }
    next();
  } catch (e) {
    errorHandler.run(req, res, e);
  }
};

export const middlewareSignUp = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const { fullname, email, password, dateBorn, username } = req.body;
    if (!fullname || !password || !email || !dateBorn || !username) {
      throw new IncorrectDataRequest();
    }

    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(dateBorn)) {
      throw new IncorrectDataFormat("date", dateBorn);
    }

    if (!validateDateToRegister(dateBorn)) {
      throw new IncorrectDataRequest(
        "Debes de ser mayor de edad para poder registrarte",
      );
    }
    if (!regexEmail.test(email)) {
      throw new IncorrectDataFormat("email", email);
    }

    if (password.length < 6) {
      throw new IncorrectDataFormat(
        "password",
        `${password} La contraseña debe tener como mínimo 5 caracteres`,
      );
    }
    if (!/\d/.test(password)) {
      throw new IncorrectDataFormat(
        "password",
        `${password} La contraseña debe tener almenos un caracter`,
      );
    }
    if (password.includes(" ")) {
      throw new IncorrectDataFormat(
        "password",
        `${password} La contraseña no debe tener espacios`,
      );
    }
    /*     if (!Number.isInteger(parseInt(phoneNumber)) || phoneNumber.length !== 10) {
      throw new IncorrectDataFormat(
        "phone_number",
        `${phoneNumber} el numero de telefono no es correcto`,
      );
    } */

    next();
  } catch (e) {
    errorHandler.run(req, res, e);
  }
};

export const middlewareDataUpdate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const keysValid = [
      "fullname",
      "email",
      "phoneNumber",
      "dateBorn",
      "username",
      "bio",
      "profileView",
      "receiveRequests",
      "avatar",
    ];

    const keysInvalid = ["password", "state", "updateAt", , "email"];

    const bodyKeys = Object.keys(req.body);

    const file: Express.Multer.File | undefined = req.file;

    if (bodyKeys.length === 0 && !file) {
      throw new IncorrectDataRequest("Porfavor envia parametros a actualizar");
    }

    if (file) {
      if (!file.mimetype.includes("image"))
        throw new IncorrectDataFormat("file", file.originalname);
    }

    for (const key of bodyKeys) {
      if (keysInvalid.includes(key)) {
        throw new IncorrectDataRequest(
          `No se pùede actualizar el valor ${key}  desde este endpoint`,
        );
      }
      if (!keysValid.includes(key)) {
        throw new IncorrectDataRequest(`la key ${key} es incorrecta`);
      }
    }
    next();
  } catch (e) {
    errorHandler.run(req, res, e);
  }
};

export const middlewarePasswordUpdate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const { old_password, new_password } = req.body;

    if (!old_password || !new_password) {
      throw new IncorrectDataRequest();
    }
    next();
  } catch (e) {
    errorHandler.run(req, res, e);
  }
};

export const middlewareSendEmail = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const type: string = req.query?.type as string;

    const { user } = req.body;
    if (!type || type.trim() === "") {
      throw new IncorrectDataRequest(
        "Debe de contener un tipo de envio mediante query",
      );
    }
    if (!["recoveryPassword", "verifyAccount"].includes(type)) {
      throw new IncorrectDataRequest(
        "El tipo no es correcto para el envio del correo",
      );
    }

    if (!user) {
      throw new IncorrectDataRequest(
        "Se necesita un id o el correo electronico del usuario registrado",
      );
    }

    next();
  } catch (e) {
    errorHandler.run(req, res, e);
  }
};
