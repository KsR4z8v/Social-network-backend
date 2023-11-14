import models from '../../database/models/index.js'
import responseTemplate from '../../handlersResponses/responseTemplates.js';

const { internalError } = responseTemplate

const getCommentsController = async (req, resp) => {
    const id_post = req.params.id_post;
    try {

        const comments = await models.interactionsModels.getCommentsbyPost(id_post);
        
        if (comments.length === 0) {
            return resp.status(404).json({ message: 'La publicacion no tiene comentarios'});
        }
       
        return resp.status(200).json({comments : comments})
        
    } catch (error) {
        console.log(error);
        resp.status(500).json(internalError())
    }
}


export default getCommentsController