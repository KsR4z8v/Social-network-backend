import models from '../../database/models/index.js'
import responseTemplate from '../../handlersResponses/responseTemplates.js';
const { internalError, userNotFound, invalidBodyKeys } = responseTemplate


const modifyPostController = async (req, resp) => {
    try {
        const { id_post } = req.params
        const { id_user } = req
        const { text, post_visibility } = req.body
        if (!text && post_visibility === undefined) {
            return resp.status(400).json(invalidBodyKeys())
        }
        const posts_found = await models.postModels.getPostById(id_post)
        if (!posts_found) {
            return resp.status(404).json({ message: 'La publicacion que intenta modificar no existe' })
        }
        if (posts_found.id_author !== id_user) {
            return resp.status(403).json({ message: `La publicacion que intenta modificar no pertenece al usuario ${id_user}` })
        }
        const resp_db = await models.postModels.updateDataPostById(id_post, { ...req.body })
        if (!resp_db) {
            return resp.status(404).json({ message: 'La publicacion no se ha modificado' })
        }
        return resp.sendStatus(204)
    } catch (e) {
        console.log(e);
        resp.status(500).json(internalError())

    }

}

export default modifyPostController