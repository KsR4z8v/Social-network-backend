
//import sendMail from '../../helpers/send_email.js';
import codeGenerator from '../../helpers/code_generator.js';
import responseTemplate from '../../handlersResponses/responseTemplates.js';
import encryptPassword from '../../helpers/encrypt.js'
import models from '../../database/models/index.js'
import sendEmail from '../../services/sendEmailGoogle.service.js'
const { internalError, dataAlreadyExist } = responseTemplate


const signUpController = async (req, resp) => {
    try {
        let { username, email, password, fullname, phone_number, date_born } = req.body;
        const users_found = await models.userModels.verifyIfExistUser(username, email)

        if (users_found) {
            return resp.status(409).json(dataAlreadyExist());
        }

        const verifyCode = codeGenerator(4);
        const date_created = new Date();
        const password_encrypt = await encryptPassword(password)

        const response_db = await models.userModels.insertUser({ username, password: password_encrypt, email, fullname, phone_number, date_created, date_born, verify_code: verifyCode, url_avatar: process.env.AVATAR_DEFAULT })
        sendEmail(email, fullname.split(' ')[0]).verificationEmail(verifyCode)
        resp.status(200).json({ id_user: response_db.id_user, message: 'OK' })

    } catch (error) {
        console.log(error);
        resp.status(500).json(internalError())
    }

}




export default signUpController
