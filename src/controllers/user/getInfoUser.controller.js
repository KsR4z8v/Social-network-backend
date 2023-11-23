
import responseTemplate from '../../handlersResponses/responseTemplates.js';
import models from '../../database/models/index.js';
import filterFriend from '../../helpers/filterFriend.js'
import formatUrlAvatar from '../../helpers/formatUrlAvatar.js';
const { internalError, accountDeactivated, userNotFound } = responseTemplate
const getInfoUserController = async (req, resp) => {
    try {
        const id_user = req.id_user
        const { foreign_view } = req.query

        const DEFAULT_PARAMS = [{ id_user }, ["fullname", "username", "phone_number", "email", "url_avatar", "date_born", "id_user", "user_bio", 'name_permission', "state_account", 'view_private']]
        const FOREIGN_PARAMS = [{ id_user: parseInt(foreign_view) || 0 }, ['id_user', 'fullname', 'username', 'url_avatar', 'user_bio', 'state_account', 'view_private']]
        const select_param = foreign_view ? FOREIGN_PARAMS : DEFAULT_PARAMS
        const resp_db = await models.userModels.getUser(...select_param)

        if (!resp_db) {
            return resp.status(404).json(userNotFound())
        }
        if (!resp_db.state_account) {
            return resp.status(404).json(accountDeactivated(foreign_view ? 'Esta cuenta se encuentra desactivada' : undefined))
        }
        //obtengo los amigos del usuario
        const friends_found = await models.userModels.getRelationFriendsOfUser(resp_db.id_user, foreign_view !== undefined)
        resp_db.friends = filterFriend(resp_db.id_user, friends_found)
        formatUrlAvatar([resp_db])
        resp.status(200).json(resp_db)
    } catch (error) {
        console.log(error);
        resp.status(500).json(internalError())
    }
}

export default getInfoUserController