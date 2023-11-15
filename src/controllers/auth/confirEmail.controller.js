import responseTemplate from '../../handlersResponses/responseTemplates.js';
const { internalError, incorrectCodeVerified, expireCode, userNotFound } = responseTemplate
import models from '../../database/models/index.js';
import jwt from 'jsonwebtoken'
import VerifyCodeRedisService from '../../database/redis/VerifyCodeRedisService.js';
const confirmEmailController = async (req, res) => {
    try {
        const { id_user } = req.params;
        const { entered_code } = req.body;
        const user_found = await models.userModels.getUser({ id_user }, ['id_user'])

        if (!user_found) {
            return res.status(404).json(userNotFound())
        }
        const redis_service = new VerifyCodeRedisService()
        const code_get = await redis_service.getVerificationCode(id_user.toString())

        if (!code_get) {
            return res.status(404).json(expireCode())
        }
        if (code_get != entered_code) {
            return res.status(400).json(incorrectCodeVerified())
        }

        await redis_service.deleteVerificationCode(id_user.toString())
        await models.userModels.updateSettingsUserById(id_user, { is_verified: true });

        const token = jwt.sign({ id_user }, process.env.KEY_SECRET_JWT)
        res.cookie('tkn', token)

        res.status(200).json({ tkn: token, message: 'Ok' });

    } catch (error) {
        console.log(error);
        res.status(500).json(internalError())
    }

}


export default confirmEmailController;
