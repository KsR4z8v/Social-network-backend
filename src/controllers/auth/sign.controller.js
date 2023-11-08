
import models from '../../database/models/index.js'
import responseTemplate from '../../handlersResponses/responseTemplates.js';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config()
import jwt from 'jsonwebtoken'
import codeGenerator from '../../helpers/code_generator.js';
import sendEmail from "../../services/sendEmailGoogle.service.js";
const { internalError, userNotFound, accountDeactivated, passwordIncorrect } = responseTemplate
const { userModels } = models

const sign = async (req, resp) => {
    const { email, password } = req.body;
    try {
        const user_found = await userModels.getUser({ email }, ['id_user', 'state_account', 'password', 'is_verified', 'fullname', 'email'])
        console.log(user_found);
        if (!user_found) {
            return resp.status(404).json(userNotFound())
        }

        if (!user_found.state_account) {
            return resp.status(404).json(accountDeactivated())
        }

        if (! await bcrypt.compare(password, user_found.password)) {
            return resp.status(411).json(passwordIncorrect())
        }
        if (!user_found.is_verified) {
            const verify_Code = codeGenerator(4)
            await userModels.updateDataUserById(user_found.id_user, { verify_Code })
            sendEmail(user_found.email, user_found.fullname.split(' ')[0]).verificationEmail(verify_Code)
            return resp.status(401).json({
                status: 'PENDING_TO_VERIFIED',
                data: {
                    id_user: user_found.id_user,
                    fullname: user_found.fullname
                }
            })
        }
        const token = jwt.sign({ id_user: user_found.id_user }, process.env.KEY_SECRET_JWT, { expiresIn: '6h' })
        resp.cookie('tkn', token)

        return resp.status(200).json({
            tkn: token,
            data: {
                id_user: user_found.id_user,
                username: user_found.username,
                email: user_found.email,
            }
        })
    } catch (error) {
        console.log(error);
        resp.status(500).json(internalError())
    }
}

export default sign