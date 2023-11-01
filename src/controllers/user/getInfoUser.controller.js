
import responseTemplate from '../../handlersResponses/responseTemplates.js';
import models from '../../database/models/index.js';
const { userNotFound } = responseTemplate
const getInfoUserController = async (req, resp) => {
    try {
        const { id_user } = req.params
        const resp_db = await models.userModels.getInfoUserById(id_user)
        if (!resp_db) {
            return resp.status(404).json(userNotFound())
        }
        resp.status(200).json(resp_db)
    } catch (error) {
        console.log(error);
        resp.status(500).json(internalError())
    }
}

export default getInfoUserController