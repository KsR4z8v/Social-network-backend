import models from '../../database/models/index.js'
import responseTemplate from '../../handlersResponses/responseTemplates.js';
const { internalError, userNotFound, invalidBodyKeys } = responseTemplate


const modifyPostController = async (req, resp) => {
    try {
        const { id_post } = req.params
        const { text, state_post } = req.body
        if (!text && state_post === undefined) {
            console.log(text, state_post);
            return resp.status(400).json(invalidBodyKeys())
        }
        const resp_db = await models.postModels.updateDataPostById(id_post, { text, state_post })

        if (!resp_db) {
            return resp.status(404).json(userNotFound())
        }
        return resp.status(200).json({ message: 'OK' })
    } catch (error) {
        console.log(error);
        resp.status(500).json(internalError())

    }

}

export default modifyPostController