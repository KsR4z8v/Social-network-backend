import models from '../../../database/models/index.js'
import responseTemplate from '../../../handlersResponses/responseTemplates.js';
const { internalError } = responseTemplate

const deleteFriend = async (req, res) => {
    const { id_relation } = req.body;
    try {
        const resp_db = await models.userModels.deleteFriend(id_relation)
        return res.status(200).json({ message: 'La relacion ha sido borrada con exito' })
    } catch (err) {
        console.log(err);
        return res.status(500).json(internalError());
        
    }

}



export default deleteFriend;