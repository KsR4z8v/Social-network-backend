import modelo from '../../database/models/index.js'
import responseTemplate from '../../handlersResponses/responseTemplates.js';
const { internalError, userNotFound } = responseTemplate

const likePostController = async (req,res)=>{
    try{
        const id_post = req.rarams.id_post;
        const likes = 0
        const postLike = await modelo.postModels.updateDataPostById(id_post , {likes : likes + 1});

    }catch(err){
        return res.responseTemplate(internalError());
    }
}


export default likePostController;