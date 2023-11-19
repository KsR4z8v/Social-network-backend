import models from '../../database/models/index.js'
import responseTemplate from '../../handlersResponses/responseTemplates.js';
import formatUrlAvatar from '../../helpers/formatUrlAvatar.js';
const { internalError } = responseTemplate

const getCommentsController = async (req, resp) => {

    try {
        const id_post = req.params.id_post;
        let comments = await models.interactionsModels.getCommentsbyPost(id_post);
        if (comments.length === 0) {
            return resp.status(200).json({ message: 'La publicacion no tiene comentarios', comments: [] });
        }
        formatUrlAvatar(comments)
        return resp.status(200).json({ comments });

    } catch (err) {
        console.log(err);
        resp.status(500).json(internalError())
    }
}


export default getCommentsController