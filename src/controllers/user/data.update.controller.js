import models from '../../database/models/index.js'
import responseTemplate from '../../handlersResponses/responseTemplates.js';

const { internalError, userNotFound } = responseTemplate

const dataUpdateController = async (req, resp) => {
    try {
        const { id_user, fullname, username, phone_number, email, date_born } = req.body

        const resp_db = await models.userModels.updateDataUserById(id_user, fullname, username, phone_number, email, date_born)

        if (!resp_db) {
            return resp.status(404).json(userNotFound())
        }

        return resp.status(200).json({ message: 'OK' })
    } catch (error) {
        console.log(error);
        resp.status(500).json(internalError())

    }

}

export default dataUpdateController