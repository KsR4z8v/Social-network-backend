import dotenv from "dotenv";
import { CookieOptions } from "express";
import { SessionOptions } from "express-session";
import { type ImageKitOptions } from "imagekit/dist/libs/interfaces";
import { SignOptions } from "jsonwebtoken";
dotenv.config({ path: ".env.development.local" });

export const IMAGE_KIT_CONFIG: ImageKitOptions = {
  publicKey: process.env.PUBLIC_KEY_IMAGEKIT ?? "",
  privateKey: process.env.PRIVATE_KEY_IMAGEKIT ?? "",
  urlEndpoint: process.env.URL_ENDPOINT_IMAGEKIT ?? "",
};

export const CONFIG_CORS = {
  origin: [
    "https://snapwire.onrender.com",
    "https://wz6lg1mk-3000.use.devtunnels.ms",
    "http://localhost:3000",
  ],
  credentials: true,
};

export const SERVER_CONFIG = {
  port: process.env.PORT ?? 8000,
  logger: true,
};

export const CONFIG_SESSION: SessionOptions = {
  secret: process.env.SECRET_SESSION ?? "secret",
  name: "sessionId",
  resave: true,
  rolling: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7200000,
    priority: "high",
  },
};

export const CONFIG_COOKIE_TOKEN: CookieOptions = {
  secure: false,
  httpOnly: true,
  sameSite: "strict",
  maxAge: 7200000,
  priority: "high",
};

export const CONFIG_TOKEN: SignOptions = {
  expiresIn: 7200,
};

export default {
  CONFIG_CORS,
  CONFIG_TOKEN,
  CONFIG_SESSION,
  CONFIG_COOKIE_TOKEN,
  IMAGE_KIT_CONFIG,
  SERVER_CONFIG,
};
