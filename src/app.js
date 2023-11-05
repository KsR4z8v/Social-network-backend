import Express from "express";
import cors from 'cors'
const app = Express()
import config from "./configs/config.js";
import app_routes from "./routes/app.routes.js";
import expressfileupload from 'express-fileupload'
import cookieparser from 'cookie-parser'
app.use(cors(config.config_cors))
app.use(cookieparser('_-__-_'))
app.use(Express.json())
app.use(expressfileupload())
app.use(Express.urlencoded({ extended: false }))
app.get('/', (req, resp) => {
    resp.status(200).json({ message: "Welcome to server SnapWire!!" })
})

app.use(app_routes)
export default app