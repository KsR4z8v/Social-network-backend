import models from '../../database/models/index.js'
import responseTemplate from '../../handlersResponses/responseTemplates.js';
import codeGenerator from "../../helpers/code_generator.js";
import sendEmail from "../../services/sendEmailGoogle.service.js";
import jwt from 'jsonwebtoken'

const { internalError, userNotFound } = responseTemplate
const { userModels } = models

const sendEmailController = async (req, resp) => {
    try {
        const { type } = req.query;

        const { id_user, email } = req.body

        const user_found = await userModels.getUser({ id_user, email }, ['email', 'fullname', 'state_account'])

        if (!user_found) {
            return resp.status(409).json(userNotFound());
        }
        if (!user_found.state_account) {
            return resp.status(404).json(accountDeactivated())
        }
        const user_fullname = user_found.fullname.split(' ')[0]
        if (type === 'verifyAccount') {
            const verify_Code = codeGenerator(4)
            await userModels.updateDataUserById(id_user, { verify_Code })
            sendEmail(user_found.email, user_fullname).verificationEmail(verify_Code)
        }
        if (type === 'recoveryPassword') {
            const authorization = jwt.sign({ code: codeGenerator(10) }, process.env.RESTORE_KEY_PASSWORD, { expiresIn: '10m' })
            const token = jwt.sign({ id_user: user_found.id_user, authorization }, process.env.KEY_SECRET_JWT, { expiresIn: '1h' })
            sendEmail(user_found.email, user_fullname).resetPasswordLink(token)
        }
        resp.status(200).json({ message: 'Ok' })
    } catch (error) {
        console.log(error);
        resp.status(500).json(internalError())
    }
}


export default sendEmailController