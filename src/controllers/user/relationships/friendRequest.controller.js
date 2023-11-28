import models from '../../../database/models/index.js'
import responseTemplate from '../../../handlersResponses/responseTemplates.js';
const { internalError } = responseTemplate

const friendRequest = async (req, res) => {
    const { id_user } = req;
    const { to_user } = req.params;
    try {
        const request_friend = await models.userModels.verifyRequestFriend(id_user, to_user);
        if (!request_friend) {
            const friendreq = await models.userModels.sendFriendRequest(id_user, to_user);
            if (!friendreq) return res.status(400).json({ message: 'Error al enviar la solicitud de amistad' });
            return res.status(200).json({ message: 'Solicitud de amistad enviada' });
        }
        if (request_friend.friend_state === 'accepted') return res.status(200).json({ message: 'Ya tienes una amistad con este usuario' });

        if (request_friend.user_requesting === id_user) return res.status(400).json({ message: 'Ya has enviado una solicitud a este usuario' });

        if (request_friend.user_requesting !== id_user) await models.userModels.acceptRequestFriend(request_friend.id_relation)

        return res.status(200).json({ message: 'La relacion ha sido creada con exito' })
    } catch (e) {
        console.log(e);
        return res.status(500).json(internalError());
    }

}



export default friendRequest;