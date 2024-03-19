import Express, { Request, Response } from "express";
import cors from "cors";
import config from "./configs/config";
import app_routes from "./routes/app.routes";
import logger from "./middlewares/logger.middleware";
import configs from "./configs/config";
import session from "express-session";

const app = Express();

app.disable("x-powered-by");
app.use(cors(config.config_cors));
app.use(logger);

app.use(
  session({
    secret: process.env.SECRET_SESSION || "secreteKey",
    resave: true,
    saveUninitialized: true,
    cookie: configs.config_cookie,
  })
);

app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));

app.get("/", (req: Request, resp: Response) => {
  resp.status(400).json({ message: "Welcome to server SnapWire" });
});

app.use("/api/v1", app_routes);
export default app;
