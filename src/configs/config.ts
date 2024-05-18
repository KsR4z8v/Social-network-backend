import dotenv from "dotenv";
import { type ImageKitOptions } from "imagekit/dist/libs/interfaces";
dotenv.config({ path: ".develop.env" });

const IMAGE_KIT_CONFIG: ImageKitOptions = {
  publicKey: process.env.PUBLIC_KEY_IMAGEKIT ?? "",
  privateKey: process.env.PRIVATE_KEY_IMAGEKIT ?? "",
  urlEndpoint: process.env.URL_ENDPOINT_IMAGEKIT ?? "",
};

export default {
  config_cors: {
    origin: [
      "https://snapwire.onrender.com",
      "https://wz6lg1mk-3000.use.devtunnels.ms",
      "http://localhost:3000",
    ],
    credentials: true,
  },
  IMAGE_KIT_CONFIG,
  logger: true,
  config_cookie: {
    path: "/",
    domain: "snapwire.onrender.com",
    secure: false,
    httpOnly: true,
    sameSite: true,
    expires: new Date(Date.now() + 86400000),
  },
  config_token: {
    expiresIn: "6h",
  },
};
