
import responseTemplates from "../handlersResponses/responseTemplates.js"
const { invalidBodyKeys, invalidDateFormat, invalidFormatPassword } = responseTemplates

export const middleware_Sign = (req, resp, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return resp.status(411).json(invalidBodyKeys())
    }
    next()
}


export const middleware_SignUp = (req, resp, next) => {
    const { fullname, email, password, date_born, phone_number, username } = req.body
    if (!fullname || !password || !email || !date_born || !phone_number || !username) {
        return resp.status(411).json(invalidBodyKeys())
    }
    const data = date_born.split('-')
    const current_year = new Date().getFullYear()

    console.log(Number.isInteger(parseInt(data[0])));
    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    if (!regex.test(date_born)) {
        return resp.status(400).json(invalidDateFormat());
    }
    if (data[0] > current_year) {
        return resp.status(400).json(invalidDateFormat());
    }
    if (password.length < 5) {
        return resp.status(400).json(invalidFormatPassword('La contraseña debe tener como mínimo 5 caracteres'));
    }
    if (! /\d/.test(password)) {
        return resp.status(400).json(invalidFormatPassword('La contraseña debe contener almenos un caracter numérico'));
    }
    next()
}




