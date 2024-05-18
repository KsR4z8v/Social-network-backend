import Express, { type Request, type Response } from "express";
import cors from "cors";
import config from "./configs/config";
import app_routes from "./routes/app.routes";
import logger from "./middlewares/logger.middleware";
import session from "express-session";

const app = Express();

app.disable("x-powered-by");
app.use(cors(config.config_cors));
app.use(logger);

app.use(
  session({
    secret: process.env.SECRET_SESSION ?? "secret",
    resave: true,
    saveUninitialized: true,
    cookie: config.config_cookie,
  }),
);

app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));

app.get("/", (req: Request, resp: Response) => {
  resp.status(400).json({ message: "Welcome to server SnapWire" });
});

app.use("/api/v1", app_routes);
export default app;
