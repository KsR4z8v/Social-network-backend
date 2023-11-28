import responseTemplate from '../../handlersResponses/responseTemplates.js';
import dotenv from 'dotenv'
dotenv.config()
const { internalError } = responseTemplate

const logoutController = (req, res) => {
    try {
        res.clearCookie('tkn')
        //TODO eliminar sesion..
        res.sendStatus(204)
    } catch (e) {
        console.log(e);
        return res.status(500).json(internalError())
    }
}

export default logoutController