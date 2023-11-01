import models from '../../database/models/index.js'
import responseTemplate from '../../handlersResponses/responseTemplates.js';
import encryptPassword from '../../helpers/encrypt.js';
import bcrypt from 'bcrypt'
const { internalError, userNotFound, passwordIncorrect } = responseTemplate

const passwordUpdateController = async (req, resp) => {
    try {
        const { id_user } = req.params
        const { old_password, new_password } = req.body

        const user_found = await models.userModels.getPasswordUserById(id_user)

        if (!user_found) {
            return resp.status(404).json(userNotFound())
        }

        if (!await bcrypt.compare(old_password, user_found.password)) {
            return resp.status(411).json(passwordIncorrect())
        }
        const password_new_hash = await encryptPassword(new_password)

        if (await bcrypt.compare(old_password, password_new_hash)) {
            return resp.status(411).json({
                message: 'son iguales'
            })
        }

        await models.userModels.passwordUpdate(id_user, password_new_hash);

        resp.sendStatus(200)

    } catch (error) {
        console.log(error);
        resp.status(500).json(internalError())

    }
}


export default passwordUpdateController;