
import responseTemplate from '../../handlersResponses/responseTemplates.js';
import models from '../../database/models/index.js';
import { query } from 'express';
const { internalError, accountDeactivated, userNotFound } = responseTemplate
const getInfoUserController = async (req, resp) => {
    try {
        const id_user = req.id_user
        const DEFAULT_PARAMS = [{ id_user }, ["fullname", "username", "phone_number", "email", "url_avatar", "date_born", "id_user", "user_bio", 'name_permission', "state_account"]]
        const FOREIGN_PARAMS = [{ id_user: parseInt(req.query.view_foreign) || 0 }, ['fullname', 'username', 'url_avatar', 'user_bio', 'state_account', 'view_private']]
        const select_param = req.query.view_foreign ? FOREIGN_PARAMS : DEFAULT_PARAMS
        const resp_db = await models.userModels.getUser(...select_param)

        if (!resp_db) {
            return resp.status(404).json(userNotFound())
        }
        if (!resp_db.state_account) {
            return resp.status(403).json(accountDeactivated(req.query.view_foreign ? 'Esta cuenta se encuentra desactivada' : undefined))
        }

        resp_db.url_avatar = resp_db.url_avatar?.split('*key:*').shift()
        resp.status(200).json(resp_db)
    } catch (error) {
        console.log(error);
        resp.status(500).json(internalError())
    }
}

export default getInfoUserController