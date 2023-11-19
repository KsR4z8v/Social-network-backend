import models from '../../database/models/index.js'
import responseTemplate from '../../handlersResponses/responseTemplates.js';
const { internalError } = responseTemplate

const likePostController = async (req, res) => {
    try {
        const id_post = req.params.id_post;
        const id_user = req.id_user;
        //verificar si el usuario ya le ha dado like al post
        const likePost = await models.interactionsModels.verifyLike(id_user, id_post)
        if (likePost) {
            await models.interactionsModels.updateStateLike(id_user, id_post, !likePost.state_like);
        } else {
            await models.interactionsModels.insertRelationLike(id_user, id_post);
        }
        return res.status(200).json({ message: 'Ok' })
    } catch (err) {
        return res.status(500).json(internalError());
    }
}


export default likePostController;