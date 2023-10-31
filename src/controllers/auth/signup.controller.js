
import sendMail from '../../helpers/send_email.js';
import codeGenerator from '../../helpers/code_generator.js';
import responseTemplate from '../../handlersResponses/responseTemplates.js';
import encryptPassword from '../../helpers/encrypt.js'
import models from '../../database/models/index.js'

const { internalError, dataAlreadyExist } = responseTemplate


const signUpController = async (req, resp) => {
    try {

        let { username, email, password, fullname, phone_number, date_born } = req.body;

        const users_found = await models.userModels.verifyIfExistUser(username, email)


        if (password.length < 5) {
            return resp.status(400).json({ text: 'La contraseña debe tener como mínimo 5 caracteres' });
        }
        if (! /\d/.test(password)) {
            return resp.status(400).json({ text: 'La contraseña debe contener almenos un caracter numérico' });
        }

        if (users_found) {
            return resp.status(409).json(dataAlreadyExist());
        }

        const verifyCode = codeGenerator(10);
        const date_created = new Date();
        const password_encrypt = await encryptPassword(password)

        const response_db = await models.userModels.insertUser(username, password_encrypt, email, fullname, phone_number, date_created, date_born, verifyCode)
        await sendMail(verifyCode, email);
        resp.redirect(`/signup/confirmEmail/${response_db}`);

    } catch (error) {
        console.log(error);
        resp.status(500).json(internalError())
    }

}




export default signUpController
