import models from "../../database/models/index.js";
import codeGenerator from "../../helpers/code_generator.js";
import responseTemplate from '../../handlersResponses/responseTemplates.js';
import sendEmail from "../../services/sendEmailGoogle.service.js";

const { internalError, userNotFound } = responseTemplate
const { userModels } = models

const sendEmailVerified = async (req, resp) => {
    try {
        const { id_user } = req.body
        const users_found = await userModels.getUser({ id_user }, ['email', 'fullname'])
        if (!users_found) {
            return resp.status(409).json(userNotFound());
        }
        const verify_Code = codeGenerator(4)
        await userModels.updateDataUserById(id_user, { verify_Code })
        sendEmail(users_found.email, users_found.fullname.split(' ')[0]).verificationEmail(verify_Code)
        resp.status(200).json({ message: 'Ok' })
    } catch (error) {
        resp.status(500).json(internalError())
    }
}


export default sendEmailVerified