/* eslint-disable @typescript-eslint/no-unsafe-argument */
import Express, { type Request, type Response } from "express";
import apiRoutes from "./Default/api.routes";
import UserDataSession from "./Default/domain/UserDataSession";
import logger from "./Auth/infrastructure/middlewares/logger.middleware";
import session from "express-session";
import {
  CONFIG_CORS,
  CONFIG_SESSION,
  SERVER_CONFIG,
} from "./Default/configs/config";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: ".develop.env" });

declare module "express-session" {
  interface SessionData {
    user: UserDataSession;
  }
}

const app = Express();

app.disable("x-powered-by");
app.use(logger);
app.use(cors(CONFIG_CORS));
app.use(session(CONFIG_SESSION));
app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));

app.get("/", (req: Request, resp: Response) => {
  resp.status(400).json({ message: "Welcome to SnapWire server" });
});

app.use("/api/v1", apiRoutes);
app.listen(SERVER_CONFIG.port, () => {
  console.log(`Server listen on port: ${SERVER_CONFIG.port}`);
});
