import models from '../../database/models/index.js'
import responseTemplate from '../../handlersResponses/responseTemplates.js';
const { internalError } = responseTemplate


const logicDeletePostController = async (req, resp) => {
    try {
        const { id_post } = req.params
        const { id_user } = req
        const post_found = await models.postModels.getPostById(id_post)
        //console.log(post_found);
        if (!post_found) {
            return resp.status(404).json({ message: 'La publicacion que intenta eliminar no existe' })
        }
        if (post_found.id_author !== id_user) {
            return resp.status(403).json({ message: `La publicacion que intenta eliminar no pertenece al usuario ${id_user}` })
        }
        const resp_db = await models.postModels.updateDataPostById(id_post, { post_status: false })
        if (!resp_db) {
            return resp.status(404).json({ message: 'La publicacion no se ha eliminado' })
        }
        return resp.sendStatus(204)
    } catch (e) {
        console.log(e);
        resp.status(500).json(internalError())

    }

}

export default logicDeletePostController;