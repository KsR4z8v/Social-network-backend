
import models from '../../database/models/index.js'
import responseTemplate from '../../handlersResponses/responseTemplates.js';
import formatUrlAvatar from '../../helpers/formatUrlAvatar.js';
import dotenv from 'dotenv'
dotenv.config()
const { internalError } = responseTemplate
const { postModels } = models

const getPostsController = async (req, resp) => {
    try {
        let posts = []
        console.log(req.query);

        if (Object.keys(req.query).length === 0) {
            posts = await postModels.getPosts()
        }
        if (req.query.self_user) {
            posts = await postModels.getPosts(parseInt(req.query.self_user), true)
        }
        if (req.query.by_user) {
            posts = await postModels.getPosts(parseInt(req.query.by_user), false)
        }

        posts = posts.map(p => {
            const aux = p
            aux.url_avatar_author = p.url_avatar_author.split('*key:*')[0]
            return p
        }
        )
        resp.status(200).json({
            posts
        })
    } catch (error) {
        console.log(error);
        resp.status(500).json(internalError())
    }
}


export default getPostsController