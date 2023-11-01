
//import sendMail from '../../helpers/send_email.js';
import codeGenerator from '../../helpers/code_generator.js';
import responseTemplate from '../../handlersResponses/responseTemplates.js';
import encryptPassword from '../../helpers/encrypt.js'
import models from '../../database/models/index.js'
import jwt from 'jsonwebtoken'
import sendEmailVerification from '../../services/sendEmailGoogle.service.js';
const { internalError, dataAlreadyExist } = responseTemplate


const signUpController = async (req, resp) => {
    try {
        let { username, email, password, fullname, phone_number, date_born } = req.body;
        const users_found = await models.userModels.verifyIfExistUser(username, email)

        if (users_found) {
            return resp.status(409).json(dataAlreadyExist());
        }

        const verifyCode = codeGenerator(10);
        const date_created = new Date();
        const password_encrypt = await encryptPassword(password)


        const response_db = await models.userModels.insertUser(username, password_encrypt, email, fullname, phone_number, date_created, date_born, verifyCode)
        sendEmailVerification(fullname.split(' ')[0], verifyCode, email);
        resp.status(200).json({ id_user: response_db, message: 'OK' })

    } catch (error) {
        console.log(error);
        resp.status(500).json(internalError())
    }

}




export default signUpController
