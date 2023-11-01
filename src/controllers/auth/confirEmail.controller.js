import responseTemplate from '../../handlersResponses/responseTemplates.js';
const { internalError, incorrectCodeVerified, userNotFound } = responseTemplate
import models from '../../database/models/index.js';

const confirmEmailController = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const { codigo_ingresado } = req.body;


        const usuario = await models.userModels.getInfoUserById(id_usuario);
        console.log(usuario);

        if (!usuario) {
            return res.status(404).json(userNotFound())
        }
        if (usuario.verify_code != codigo_ingresado) {
            return res.status(400).json(incorrectCodeVerified())
        }

        await models.userModels.updateStateToActive(id_usuario);

        res.status(200).json({ message: 'Ok' });

    } catch (error) {
        console.log(error);
        res.status(500).json(internalError())
    }

}


export default confirmEmailController;
