import models from '../../../database/models/index.js'
import responseTemplate from '../../../handlersResponses/responseTemplates.js';
const { internalError } = responseTemplate

const deleteRelationController = async (req, res) => {
    const { id_relation } = req.params;
    const { id_user } = req
    try {
        let resp_db;
        const { type } = req.query

        if (type === 'request') {
            resp_db = await models.userModels.deleteRequest(id_user, id_relation)
        } else {
            resp_db = await models.userModels.deleteFriend(id_relation)
        }

        if (!resp_db) {
            return res.status(404).json({ message: 'La relacion no existe o la solicitud no existe' })
        }
        return res.status(200).json({ message: 'La relacion ha sido borrada con exito' })
    } catch (err) {
        console.log(err);
        return res.status(500).json(internalError());

    }

}



export default deleteRelationController;