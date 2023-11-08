import models from '../../database/models/index.js'
import responseTemplate from '../../handlersResponses/responseTemplates.js';
import jwt from 'jsonwebtoken'
import encryptPassword from '../../helpers/encrypt.js';
const { internalError, userNotFound } = responseTemplate
const { userModels } = models


const restorePasswordController = async (req, resp) => {
    try {
        const { password } = req.body;
        const auth = req.authorization;
        const id_user = req.id_user;

        jwt.verify(auth, process.env.RESTORE_KEY_PASSWORD)

        const data_tkn = jwt.decode(auth)

        const user_found = await userModels.getUser({ id_user }, ['id_user'])

        console.log(user_found);

        if (!user_found) {
            return resp.status(404).json(userNotFound())
        }
        const password_hash = await encryptPassword(password)
        await userModels.updateDataUserById(id_user, { password: password_hash })
        return resp.status(201).json({
            message: "ok"
        })
    } catch (error) {
        console.log(error);
        resp.status(500).json(internalError())
    }
}

export default restorePasswordController;