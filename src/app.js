import Express from "express";
import cors from 'cors'
const app = Express()
import config from "./configs/config.js";
import app_routes from "./routes/app.routes.js";
import expressfileupload from 'express-fileupload'
import cookieparser from 'cookie-parser'
import logger from "./middlewares/logger.middleware.js";
import configs from "./configs/config.js";
import session from 'express-session'

app.disable('x-powered-by')
app.use(cors(config.config_cors))
app.use(logger)
app.use(cookieparser())

app.use(session({
    secret: process.env.SECRET_SESSION,
    resave: true,
    saveUninitialized: true,
    cookie: configs.config_cookie,
}))

app.use(Express.json())
app.use(expressfileupload())
app.use(Express.urlencoded({ extended: false }))
app.get('/', (req, resp) => {
    resp.status(200).json({ message: "Welcome to server SnapWire!!" })
})

app.use(app_routes)
export default app