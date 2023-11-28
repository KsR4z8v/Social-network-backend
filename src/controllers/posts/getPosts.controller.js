
import models from '../../database/models/index.js'
import responseTemplate from '../../handlersResponses/responseTemplates.js';
import formatUrlAvatar from '../../helpers/formatUrlAvatar.js';
import dotenv from 'dotenv'
dotenv.config()
const { internalError } = responseTemplate
const { postModels } = models

const getPostsController = async (req, resp) => {
    try {
        const { id_user } = req
        const { by_user, cursorIdPost, querySearch } = req.query
        // console.log(parseInt(by_user) === id_user);

        //?console.log({ by_user, cursorIdPost, querySearch });

        let posts = await postModels.getPosts({
            id_user: parseInt(by_user),
            id_post_cursor: parseInt(cursorIdPost),
            querySearch
        },
            parseInt(by_user) === id_user)

        posts = posts.map(p => {
            const aux = p
            aux.url_avatar_author = p.url_avatar_author.split('*key:*')[0]
            return p
        }
        )
        resp.status(200).json({
            posts
        })
    } catch (e) {
        console.log(e);
        resp.status(500).json(internalError())
    }
}


export default getPostsController