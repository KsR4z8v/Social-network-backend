
import models from '../../database/models/index.js'
import responseTemplate from '../../handlersResponses/responseTemplates.js';
import dotenv from 'dotenv'
import { upload_Media } from '../../services/imageKit.service.js';
import FailureToLoadMedia from '../../exceptions/FailureToLoadMedia.js';
import backOff from '../../helpers/backOff.js';


dotenv.config()
const { internalError, accountDeactivated, insufficientPermits, accountBanned } = responseTemplate
const { postModels, userModels } = models

const createPostController = async (req, resp) => {
    try {
        const { id_user } = req
        const media = req.media
        const { text } = req.body

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

        let url_media_inserted = media ? await upload_Media(media, process.env.MEDIA_FOLDER_DEST) : undefined; //insert images on image kit

        (async () => {
            const post_inserted = await backOff(async () => {
                return await postModels.insertPost({ id_author: id_user, text, date_upload: new Date() })
            }, { increment: 'exp' })
            // console.log(post_inserted);
            backOff(async () => {
                if (url_media_inserted) {
                    await postModels.insertMedia(post_inserted.id_post, url_media_inserted)
                }
            }, { increment: 'exp' })
        })()

        resp.sendStatus(204)
    } catch (e) {
        if (e instanceof FailureToLoadMedia) return resp.status(e.httpCode).json(internalError(e.message))
        resp.status(500).json(internalError())
    }
}


export default createPostController;