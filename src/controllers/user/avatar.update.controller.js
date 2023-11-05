import models from '../../database/models/index.js';
import responseTemplate from '../../handlersResponses/responseTemplates.js';

import { upload_Images, delete_image } from '../../services/imageKit.js';
const { internalError, userNotFound } = responseTemplate

const avatarUpdateController = async (req, resp) => {
    try {
        const id_user = req.id_user

        const { avatar_file } = req?.files

        const user_found = await models.userModels.getInfoUserById(id_user)

        if (!user_found) {
            return resp.status(404).json(userNotFound())
        }
        const url_parts = user_found.url_avatar?.split('*key:*')

        const id_file = url_parts.length === 2 ? url_parts.pop() : undefined

        if (id_file) {
            await delete_image([id_file])
        }

        const meta_data = await upload_Images([avatar_file], process.env.AVATARS_FOLDER_DEST)

        if (meta_data.length === 0) {
            return resp.status(502).json(internalError())
        }
        const resp_db = await models.userModels.updateDataUserById(id_user, {
            url_avatar: meta_data[0].url + '*key:*' + meta_data[0].id_image
        })

        return resp.status(201).json({ message: 'OK' })

    } catch (error) {
        console.log(error);
        resp.status(500).json(internalError())

    }

}

export default avatarUpdateController