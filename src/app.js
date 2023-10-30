import Express from "express";
import cors from 'cors'

import usersRouters from './routes/users.routes.js';
const app = Express()

app.use(cors(
    {
        origin: '*',
    }
))

app.use(Express.json())
app.use(Express.urlencoded({ extended: false }))


app.use(usersRouters);




app.get('/', (req, resp) => {
    resp.status(200).json({ message: "Welcome to server!!" })
})


export default app