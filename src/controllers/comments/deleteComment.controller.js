import modelo from '../../database/models/index.js'
import responseTemplate from '../../handlersResponses/responseTemplates.js';
const { internalError } = responseTemplate

const editCommentController = async (req,resp)=>{
    try{
        const id_comment = req.params.id_comment;
        const id_usuario = req.id_user;

        const comentario_a_eliminar = await modelo.interactionsModels.getCommentByid(id_comment);

        if (!comentario_a_eliminar){
            return resp.status(404).json({message : 'Comentario no encontrado'});
        }
        if(id_usuario != comentario_a_eliminar.id_user){
            return resp.status(401).json({message : 'Solo puedes eliminar tus comentarios'});
        }

        await modelo.interactionsModels.deleteComment(id_comment);
        return resp.status(201).json({ message: 'Comentario eliminado' });
    }catch(err){
        return resp.responseTemplate(internalError());
    }
}

export default editCommentController;