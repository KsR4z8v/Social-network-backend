import { Request, Response, NextFunction } from "express";
import { validateDateToRegister } from "../helpers/dateFunctions";
import IncorrectDataRequest from "../exceptions/IncorrectDataRequest";
import ErrorHandler from "../helpers/ErrorHandler";
import IncorrectDataFormat from "../exceptions/IncorrectDataFormat";
import { Types } from "mongoose";
const errorHandler: ErrorHandler = new ErrorHandler();

export const middleware_Sign = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

export const middleware_SignUp = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fullname, email, password, date_born, phone_number, username } =
      req.body;
    if (
      !fullname ||
      !password ||
      !email ||
      !date_born ||
      !phone_number ||
      !username
    ) {
      throw new IncorrectDataRequest();
    }

    const data = date_born.split("-");
    const current_year = new Date().getFullYear();

    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    const regex_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(date_born)) {
      throw new IncorrectDataFormat("date", date_born);
    }
    if (data[0] > current_year) {
      throw new IncorrectDataRequest("La fecha es mayor a la actual");
    }
    if (!validateDateToRegister(date_born)) {
      throw new IncorrectDataRequest(
        "Debes de ser mayor de edad para poder registrarte"
      );
    }
    if (!regex_email.test(email)) {
      throw new IncorrectDataFormat("email", email);
    }

    if (password.length < 6) {
      throw new IncorrectDataFormat(
        "password",
        `${password} La contraseña debe tener como mínimo 5 caracteres`
      );
    }
    if (!/\d/.test(password)) {
      throw new IncorrectDataFormat(
        "password",
        `${password} La contraseña debe tener almenos un caracter`
      );
    }
    if (password.includes(" ")) {
      throw new IncorrectDataFormat(
        "password",
        `${password} La contraseña no debe tener espacios`
      );
    }
    if (
      !Number.isInteger(parseInt(phone_number)) ||
      phone_number.length !== 10
    ) {
      throw new IncorrectDataFormat(
        "phone_number",
        `${phone_number} el numero de telefono no es correcto`
      );
    }

    next();
  } catch (e) {
    errorHandler.run(req, res, e);
  }
};

export const middleware_DataUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let keys_valids = [
      "fullname",
      "email",
      "phone_number",
      "date_born",
      "username",
      "bio",
    ];

    if (req.query.data === "config") {
      keys_valids = ["viewProfile"];
    }

    const keys_invalids = [
      "password",
      "state_account",
      "date_created",
      "verify_code",
      "url_avatar",
      "email",
    ];
    const data = req.body;
    const keys = Object.keys(data);

    if (keys.length === 0) {
      throw new IncorrectDataRequest("Porfavor envia parametros a actualizar");
    }
    for (const key of keys) {
      if (keys_invalids.includes(key)) {
        throw new IncorrectDataRequest(
          `No se pùede actualizar el valor ${key}  desde este endpoint`
        );
      }
      if (!keys_valids.includes(key)) {
        throw new IncorrectDataRequest(`la key ${key} es incorrecta`);
      }
    }
    next();
  } catch (e) {
    errorHandler.run(req, res, e);
  }
};
export const middleware_avatarUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: Express.Multer.File | undefined = req.file;

    if (!data) {
      throw new IncorrectDataRequest("No se ha cargado una imagen");
    }
    if (!data.mimetype.includes("image")) {
      throw new IncorrectDataFormat("file", data.originalname);
    }
    next();
  } catch (e) {
    errorHandler.run(req, res, e);
  }
};

export const middleware_passwordUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

export const middleware_sendEmail = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const type: string = req.query?.type as string;

    const { email, id_user } = req.body;
    if (!type || type.trim() === "") {
      throw new IncorrectDataRequest(
        "Debe de contener un tipo de envio mediante query"
      );
    }
    if (!["recoveryPassword", "verifyAccount"].includes(type)) {
      throw new IncorrectDataRequest(
        "El tipo no es correcto para el envio del correo"
      );
    }

    if (!email && !id_user) {
      throw new IncorrectDataRequest(
        "Se necesita un id o el correo electronico del usuario registrado"
      );
    }

    const regex_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !regex_email.test(email)) {
      throw new IncorrectDataFormat(
        "email",
        "El correo  no tiene un formato valido"
      );
    }
    if (id_user && !Types.ObjectId.isValid(id_user)) {
      throw new IncorrectDataFormat(
        "id",
        "El id del usuario no tiene un formato valido"
      );
    }

    next();
  } catch (e) {
    errorHandler.run(req, res, e);
  }
};
