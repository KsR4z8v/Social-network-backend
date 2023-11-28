import models from '../../database/models/index.js'
import responseTemplate from '../../handlersResponses/responseTemplates.js';
const { internalError } = responseTemplate

const getLikesPostController = async (req, resp) => {
    try {
        const id_post = req.params.id_post;
        const likesPost = await models.interactionsModels.getInfoLikesPost(id_post)
        if (likesPost.length === 0) {
            return resp.status(404).json({ message: 'Esta publicacion aun no tiene likes' })
        }
        likesPost.map(lk => {
            const aux = lk
            aux.user[2] = aux.user[2].split('*key:*')[0]
            return aux
        })
        return resp.status(200).json({ id_post, likesPost })
    } catch (e) {
        console.log(e);
        return resp.status(500).json(internalError());
    }
}

export default getLikesPostController