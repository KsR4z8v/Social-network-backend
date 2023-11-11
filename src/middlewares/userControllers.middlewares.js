
import responseTemplates from "../handlersResponses/responseTemplates.js"
const { invalidBodyKeys, invalidDateFormat, invalidFormatPassword, invalidEmailFormat } = responseTemplates
import { validateDateToRegister } from "../helpers/dateFunctions.js"
export const middleware_Sign = (req, resp, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return resp.status(400).json(invalidBodyKeys())
    }
    next()
}


export const middleware_SignUp = (req, resp, next) => {
    const { fullname, email, password, date_born, phone_number, username } = req.body
    if (!fullname || !password || !email || !date_born || !phone_number || !username) {
        return resp.status(400).json(invalidBodyKeys())
    }
    const data = date_born.split('-')
    const current_year = new Date().getFullYear()

    console.log(Number.isInteger(parseInt(data[0])));
    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    const regex_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regex.test(date_born)) {
        return resp.status(422).json(invalidDateFormat());
    }
    if (!validateDateToRegister(date_born)) {
        return resp.status(422).json(invalidEmailFormat('Debes de ser mayor de edad para poder registrarte'));
    }
    if (!regex_email.test(email)) {
        return resp.status(422).json(invalidEmailFormat());
    }
    if (data[0] > current_year) {
        return resp.status(422).json(invalidDateFormat());
    }
    if (password.length < 5) {
        return resp.status(422).json(invalidFormatPassword('La contraseña debe tener como mínimo 5 caracteres'));
    }
    if (!Number.isInteger(parseInt(phone_number)) || phone_number.length !== 10) {
        return resp.status(422).json(invalidFormatPassword('El numero de telefono no es correcto'));
    }
    if (! /\d/.test(password)) {
        return resp.status(422).json(invalidFormatPassword('La contraseña debe contener almenos un caracter numérico'));
    }
    next()
}


export const middleware_DataUpdate = (req, resp, next) => {
    let keys_valids = ['fullname', 'email', 'phone_number', 'date_born', 'username', 'user_bio'];

    if (req.query.data === 'config') {
        keys_valids = ['view_private']
    }

    const keys_invalids = ['password', 'state_account', 'date_created', 'verify_code', 'url_avatar', 'email']
    const data = req.body
    const keys = Object.keys(data)

    if (keys.length === 0) {
        return resp.status(400).json({ message: `Porfavor envia parametros a actualizar` })
    }
    for (const key of keys) {
        if (keys_invalids.includes(key)) {
            return resp.status(400).json({ message: `No se pùede actualizar el valor ${key}  desde este endpoint` })
        }
        if (!keys_valids.includes(key)) {
            return resp.status(422).json({ message: `la key ${key} es incorrecta` })
        }
    }
    next()

}
export const middleware_avatarUpdate = (req, resp, next) => {
    const data = req?.files
    if (!data) {
        return resp.status(400).json({ message: 'Debes de enviar un formato valido' })
    }
    if (!data.avatar_file.mimetype.includes('image/')) {
        return resp.status(400).json({ message: 'El archivo que intenta subir no es una imagen' })
    }
    next()
}

export const middleware_passwordUpdate = (req, resp, next) => {
    const { old_password, new_password } = req.body;

    if (!old_password || !new_password) {
        return resp.status(400).json({ message: 'Debes ingresar todos los parametros ' })
    }
    next()
}


export const middleware_sendEmail = (req, resp, next) => {
    const { type } = req.query
    const { email, id_user } = req.body
    if (!type || type.trim() === '') {
        return resp.status(400).json({ message: 'Debe de contener un tipo de envio mediante query' })
    }
    if (!['recoveryPassword', 'verifyAccount'].includes(type)) {
        return resp.status(422).json({ message: 'El tipo no es correcto para el envio del correo' })
    }

    if (!email && !id_user) {
        return resp.status(400).json({ message: 'Se necesita un id o el correo electronico del usuario registrado' })
    }

    const regex_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (email && !regex_email.test(email)) {
        return resp.status(422).json({ message: 'El correo electronico no tiene un formato valido' })
    }
    if (id_user && !Number.isInteger(id_user)) {
        return resp.status(422).json({ message: 'El id del usuario no tiene un formato valido' })
    }

    next()

}

