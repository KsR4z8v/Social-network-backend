import modelo from '../../database/models/index.js'
import responseTemplate from '../../handlersResponses/responseTemplates.js';
const { internalError } = responseTemplate

const likePostController = async (req,res)=>{
    try{
        const id_post = req.params.id_post;
        const id_usuario = req.id_user;

        let current_likes_post =  await  modelo.likesModels.getLikesbyPost(id_post);

        //verificar si el usuario ya le ha dado like al post
        const likePost = await modelo.likesModels.verifyLike(id_usuario , id_post);
        
        
        if(likePost){
           
            await modelo.likesModels.removeLike(id_usuario ,id_post);
            current_likes_post-=1;

            await modelo.postModels.updateDataPostById(id_post , {likes : current_likes_post});

            return res.status(200).json({message : 'Unlike'})
        }else{
           
            await modelo.likesModels.addLike(id_usuario, id_post);
            current_likes_post+=1;

            await modelo.postModels.updateDataPostById(id_post , {likes : current_likes_post});

            return res.status(200).json({message : 'Like'})
        }
    }catch(err){
        return res.responseTemplate(internalError());
    }
}


export default likePostController;