import models from '../../database/models/index.js';
import responseTemplate from '../../handlersResponses/responseTemplates.js';
import backOff from '../../helpers/backOff.js';
import FailureToLoadMedia from '../../exceptions/FailureToLoadMedia.js';
import { upload_Media, delete_Media } from '../../services/imageKit.service.js';
const { internalError, userNotFound } = responseTemplate

const avatarUpdateController = async (req, resp) => {
    try {
        const id_user = req.id_user

        const { avatar_file } = req?.files

        const user_found = await models.userModels.getUser({ id_user }, ['url_avatar'])

        if (!user_found) {
            return resp.status(404).json(userNotFound())
        }
        const url_parts = user_found.url_avatar?.split('*key:*')

        const id_file = url_parts.length === 2 ? url_parts.pop() : undefined

        if (id_file) {
            delete_Media([id_file])
        }

        const meta_data = await upload_Media([avatar_file], process.env.AVATARS_FOLDER_DEST)
        backOff(async () => {
            await models.userModels.updateDataUserById(id_user, {
                url_avatar: meta_data[0].url_media + '*key:*' + meta_data[0].id_kit
            })
        },
            {
                increment: 'exp'
            }
        )
        return resp.sendStatus(204)
    } catch (e) {
        console.log(e);
        if (e instanceof FailureToLoadMedia) return resp.status(e.httpCode).json(internalError(e.message))
        resp.status(500).json(internalError())

    }

}

export default avatarUpdateController