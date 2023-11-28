import models from '../../database/models/index.js'
import responseTemplate from '../../handlersResponses/responseTemplates.js';
const { internalError } = responseTemplate

const reportPostController = async (req, res) => {
    try {
        const id_post = req.params.id_post;
        const id_user = req.id_user;
        const reason = req.body.reason;
        
        const post = await models.postModels.getPost(id_post);
        
        if(!post || post.state_post === false){
            return res.status(404).json({message : 'la publicacion no existe'});
        }else{
            const report = await models.postModels.insertReport({id_post : id_post , id_user : id_user, reason : reason , date : new Date()});
            return res.status(200).json({ message: 'Ok' })
        }
    } catch (err) {
         return res.status(500).json(internalError());
    }
}


export default reportPostController;