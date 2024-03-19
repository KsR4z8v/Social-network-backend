import { Request } from "express";
import { Jwt, JwtPayload, decode } from "jsonwebtoken";

const getDataToken = (req: Request): Record<string, any> => {
  const auth: undefined | string = req.headers.authorization;
  if (!auth) {
    throw new Error("token not found");
  }
  const token: string = auth.split("Bearer ")[1];
  const data: Jwt | null = decode(token, {
    complete: true,
  });
  if (!data) {
    throw new Error("Not data found");
  }
  return data;
};

export default getDataToken;
