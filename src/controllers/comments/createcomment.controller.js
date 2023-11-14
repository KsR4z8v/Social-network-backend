import modelo from '../../database/models/index.js'
import responseTemplate from '../../handlersResponses/responseTemplates.js';
const { internalError } = responseTemplate

const createCommentController = async (req,resp)=>{
    try{
        const id_post = req.params.id_post;
        const id_usuario = req.id_user;
        const texto = req.body.text;

        const user_found = await modelo.userModels.getUser({ id_usuario }, ['state_account', 'self_creation_post', 'permission'])
        if (!user_found.state_account) {
            return resp.status(404).json(accountDeactivated())
        }
        if (!user_found.permission) {
            return resp.status(403).json(accountBanned())
        }

        await modelo.interactionsModels.addComment({ id_post : id_post , id_user : id_usuario, date : new Date() , text : texto , state_comment : true});
        return resp.status(201).json({ message: 'Comentario creado exitosamente.' });
    }catch(err){
        return resp.responseTemplate(internalError());
    }
}


export default createCommentController;