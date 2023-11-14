import modelo from '../../database/models/index.js'
import responseTemplate from '../../handlersResponses/responseTemplates.js';
const { internalError } = responseTemplate

const editCommentController = async (req,resp)=>{
    try{
        const id_comment = req.params.id_comment;
        const id_usuario = req.id_user;
        const newtext = req.body.text;

        const comentario_a_editar = await modelo.interactionsModels.getCommentByid(id_comment);

        if (!comentario_a_editar){
            return resp.status(404).json({message : 'Comentario no encontrado'});
        }
        if(id_usuario != comentario_a_editar.id_user){
            return resp.status(401).json({message : 'Solo puedes editar tus comentarios'});
        }

        await modelo.interactionsModels.editComment(id_comment, newtext, new Date());
        return resp.status(201).json({ message: 'Cambios guardados' });
    }catch(err){
        return resp.responseTemplate(internalError());
    }
}

export default editCommentController;