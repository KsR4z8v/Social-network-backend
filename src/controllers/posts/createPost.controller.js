
import models from '../../database/models/index.js'
import responseTemplate from '../../handlersResponses/responseTemplates.js';
import dotenv from 'dotenv'
import { upload_Media } from '../../services/imageKit.js';
dotenv.config()
const { internalError, accountDeactivated, insufficientPermits, accountBanned } = responseTemplate
const { postModels, userModels } = models

const createPostController = async (req, resp) => {
    try {
        const { id_user } = req
        const media = req.media

        const user_found = await userModels.getUser({ id_user }, ['state_account', 'self_creation_post', 'permission'])
        if (!user_found.state_account) {
            return resp.status(404).json(accountDeactivated())
        }
        if (!user_found.permission) {
            return resp.status(403).json(accountBanned())
        }
        if (!user_found.self_creation_post) {
            return resp.status(403).json(insufficientPermits('No tienes suficientes permisos para crear una publicacion'))
        }

        let url_media_inserted = media ? await upload_Media(media, process.env.MEDIA_FOLDER_DEST) : undefined //insert images on image kit
        const { text } = req.body
        console.log(url_media_inserted);
        await postModels.insertPost({ id_author: id_user, text, date_upload: new Date() }, url_media_inserted)

        resp.sendStatus(204)
    } catch (error) {
        console.log(error.message);
        resp.status(500).json(internalError())
    }
}


export default createPostController;