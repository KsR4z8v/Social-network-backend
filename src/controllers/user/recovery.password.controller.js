import models from '../../database/models/index.js'
import responseTemplate from '../../handlersResponses/responseTemplates.js';
import codeGenerator from "../../helpers/code_generator.js";
import sendEmail from "../../services/sendEmailGoogle.service.js";
import jwt from 'jsonwebtoken'

const { internalError, userNotFound, passwordIncorrect } = responseTemplate
const { userModels } = models


const recoveryPassword = async (req, resp) => {
    try {

        const { email } = req.body;

        const user_found = await userModels.getUser({ email }, ['id_user', 'fullname', 'state_account'])
        console.log(user_found);
        if (!user_found) {
            return resp.status(404).json(userNotFound())
        }

        if (!user_found.state_account) {
            return resp.status(404).json(accountDeactivated())
        }

        const token = jwt.sign({ id_user: user_found.id_user }, process.env.KEY_SECRET_JWT, { expiresIn: '1h' })
        sendEmail(email, user_found.fullname.split(' ')[0]).resetPasswordLink(token)


        return resp.status(200).json({
            tkn: token,
            data: {
                message: "ok"
            }
        })
    } catch (error) {
        console.log(error);
        resp.status(500).json(internalError())
    }
}

export default recoveryPassword;