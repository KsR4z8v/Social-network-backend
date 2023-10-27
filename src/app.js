import Express from "express";
import cors from 'cors'
const app = Express()
import config from "./configs/config.js";
import app_routes from "./routes/app.routes.js";
app.use(cors(config.cors))

app.use(Express.json())
app.use(Express.urlencoded({ extended: false }))
app.get('/', (req, resp) => {
    resp.status(200).json({ message: "Welcome to server SnapWire!!" })
})

app.use(app_routes)
export default app