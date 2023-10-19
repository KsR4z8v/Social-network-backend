import Express from "express";

const app = Express()


app.get('/', (req, resp) => {
    resp.status(200).json({ message: "Welcome to server!!" })
})


export default app