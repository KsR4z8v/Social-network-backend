
import responseTemplate from '../../handlersResponses/responseTemplates.js';
import models from '../../database/models/index.js';
const { internalError, userNotFound } = responseTemplate
const getInfoUserController = async (req, resp) => {
    try {
        const id_user = req.id_user
        const resp_db = await models.userModels.getUser({ id_user }, [
            "fullname",
            "username",
            "phone_number",
            "email",
            "url_avatar",
            "date_born",
            "id_user",
            "user_bio"])

        if (!resp_db) {
            return resp.status(404).json(userNotFound())
        }
        resp_db.url_avatar = resp_db.url_avatar?.split('*key:*').shift()
        resp.status(200).json(resp_db)
    } catch (error) {
        console.log(error);
        resp.status(500).json(internalError())
    }
}

export default getInfoUserController