import models from '../../../database/models/index.js'
import responseTemplate from '../../handlersResponses/responseTemplates.js';
const { internalError } = responseTemplate

const friendRequest = async (req,res)=>{

    const {id_user} = req;
    const {id_user2} = req.body;

    try{

        const friendreq = models.userModels.sendFriendRequest(id_user, id_user2);
        if(!friendreq) return res.status(400).json({message : 'Error al enviar la solicitud de amistad'});

        res.status(200).json({ message: 'Solicitud de amistad enviada'});

    }catch(err){
        console.log(err);
        return res.status(500).json(internalError());
    }

}



export default friendRequest;