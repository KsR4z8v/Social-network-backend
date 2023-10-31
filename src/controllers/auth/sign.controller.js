
import models from '../../database/models/index.js'
import responseTemplate from '../../handlersResponses/responseTemplates.js';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config()
import jwt from 'jsonwebtoken'

const { internalError, userNotFound, accountDeactivated, passwordIncorrect } = responseTemplate
const { userModels } = models

const sign = async (req, resp) => {
    const { email, password } = req.body;
    try {
        const user_found = await userModels.getUserByEmail(email)
        if (!user_found) {
            return resp.status(404).json(userNotFound())
        }

        if (!user_found.state_account) {
            return resp.status(404).json(accountDeactivated())
        }
        if (! await bcrypt.compare(password, user_found.password)) {
            return resp.status(411).json(passwordIncorrect())
        }

        const token = jwt.sign({ id_user: user_found.id_user }, process.env.KEY_SECRET_JWT)
        resp.cookie('tkn', token)

        return resp.status(200).json({
            data: {
                id_user: user_found.id_user,
                username: user_found.username,
                email: user_found.email,
                url_avatar: user_found.url_avatar
            }
        })
    } catch (error) {
        console.log(error);
        resp.status(500).json(internalError())
    }
}

export default sign