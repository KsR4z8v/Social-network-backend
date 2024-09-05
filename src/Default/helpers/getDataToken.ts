/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Request } from "express";
import { JsonWebTokenError, type Jwt, decode } from "jsonwebtoken";

const getDataToken = (req: Request): Record<string, any> => {
  const auth: undefined | string = req.headers.authorization;
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!auth) {
    throw new JsonWebTokenError("");
  }

  const token: string = auth.split("Bearer ")[1];
  const data: Jwt | null = decode(token, {
    complete: true,
  });
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!data) {
    throw new JsonWebTokenError("empty token");
  }
  return data;
};

export default getDataToken;
