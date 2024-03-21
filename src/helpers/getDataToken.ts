import { Request } from "express";
import {
  JsonWebTokenError,
  Jwt,
  JwtPayload,
  TokenExpiredError,
  decode,
} from "jsonwebtoken";

const getDataToken = (req: Request): Record<string, any> => {
  const auth: undefined | string = req.headers.authorization;
  if (!auth) {
    throw new JsonWebTokenError("");
  }
  const token: string = auth.split("Bearer ")[1];
  const data: Jwt | null = decode(token, {
    complete: true,
  });
  if (!data) {
    throw new JsonWebTokenError("Token vacio");
  }
  return data;
};

export default getDataToken;
