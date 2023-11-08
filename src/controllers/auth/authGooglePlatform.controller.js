import validationTokenGoogle from "../../helpers/validationTokenGoogle.js";
import responseTemplate from '../../handlersResponses/responseTemplates.js';
const { internalError } = responseTemplate
import generateCode from '../../helpers/code_generator.js'
import models from '../../database/models/index.js'
import jwt from "jsonwebtoken";
import encryptPassword from '../../helpers/encrypt.js'
import { generateDateToRegister } from '../../helpers/dateFunctions.js';
const authGooglePlatformController = async (req, resp) => {

    try {
        const { credentials } = req.body
        const payload = await validationTokenGoogle(credentials.credential)
        if (!payload) {
            resp.status(403).json({ message: 'El token no es valido' })
        }
        const { picture, name, given_name, email } = payload
        const user_found = await models.userModels.getUser({ email }, ['id_user'])

        let id_user = user_found?.id_user

        if (!user_found) {
            const date_created = new Date()
            const password = await encryptPassword(generateCode(10))
            const data = {
                phone_number: ' ',
                date_born: generateDateToRegister(),
                username: given_name,
                password,
                email, url_avatar: picture,
                fullname: name,
                date_created
            }
            const resp_db = await models.userModels.insertUser(data)
            id_user = resp_db.id_user
        }
        console.log(id_user);
        const tkn = jwt.sign({ id_user }, process.env.KEY_SECRET_JWT)

        resp.cookie('tkn', tkn)
        resp.status(200).json({ tkn, message: 'OK' })
    } catch (error) {
        console.log(error);
        resp.status(500).json(internalError())
    }
}

export default authGooglePlatformController