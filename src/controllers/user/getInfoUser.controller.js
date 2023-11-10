
import responseTemplate from '../../handlersResponses/responseTemplates.js';
import models from '../../database/models/index.js';
import { query } from 'express';
const { internalError, accountDeactivated } = responseTemplate
const getInfoUserController = async (req, resp) => {
    try {
        const id_user = req.id_user

        let resp_db;
        let message_resp;

        if (req.query.view_foreign) {
            resp_db = await models.userModels.getUser({ id_user: parseInt(req.query.view_foreign) }, ['fullname', 'username', 'url_avatar', 'user_bio', 'state_account'])
            message_resp = accountDeactivated('Esta cuenta se encuentra desactivada')
        }
        if (!resp_db) {
            resp_db = await models.userModels.getUser({ id_user }, [
                "fullname",
                "username",
                "phone_number",
                "email",
                "url_avatar",
                "date_born",
                "id_user",
                "user_bio",
                "state_account"])
            message_resp = accountDeactivated('Tu cuenta ha sido desactivada')
        }
        if (!resp_db) {
            return resp.status(404).json(userNotFound())
        }
        if (!resp_db.state_account) {
            return resp.status(403).json(message_resp)
        }

        resp_db.url_avatar = resp_db.url_avatar?.split('*key:*').shift()
        resp.status(200).json(resp_db)
    } catch (error) {
        console.log(error);
        resp.status(500).json(internalError())
    }
}

export default getInfoUserController