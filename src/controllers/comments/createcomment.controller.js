import models from '../../database/models/index.js'
import responseTemplate from '../../handlersResponses/responseTemplates.js';
const { internalError } = responseTemplate

const createCommentController = async (req, resp) => {
    try {
        const id_post = req.params.id_post;
        const id_user = req.id_user;
        const text = req.body.text;

        const user_found = await models.userModels.getUser({ id_user }, ['state_account', 'permission'])
        if (!user_found.state_account) {
            return resp.status(404).json(accountDeactivated())
        }
        if (!user_found.permission) {
            return resp.status(403).json(accountBanned())
        }

        await models.interactionsModels.addComment({ id_post, id_user, date_created: new Date(), text });
        return resp.status(201).json({ message: 'Comentario creado exitosamente.' });
    } catch (err) {
        console.log(err);
        return resp.status(500).json(internalError());
    }
}


export default createCommentController;