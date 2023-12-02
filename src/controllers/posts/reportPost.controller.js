import models from '../../database/models/index.js'
import responseTemplate from '../../handlersResponses/responseTemplates.js';
const { internalError } = responseTemplate

const reportPostController = async (req, res) => {
    try {
        const id_post = req.params.id_post;
        const id_user = req.id_user;
        const { reason, type_report } = req.body;

        const post = await models.postModels.getPostById(parseInt(id_post));

        if (!post || post.post_status === false) {
            return res.status(404).json({ message: 'la publicacion no existe' });
        } else {
            const report = await models.postModels.insertReport({ id_post, id_user, reason, type_report, date_report: new Date() });
            return res.status(200).json({ message: 'Ok' })
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json(internalError());
    }
}


export default reportPostController;