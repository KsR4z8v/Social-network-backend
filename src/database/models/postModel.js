import dotenv from 'dotenv'
import { generateQuery } from '../tools/generateQuery.tool.js'
dotenv.config()

export default (pool) => {
    const source = async (query, params) => {
        const client = await pool.connect()
        const response_db = await client.query(query, params)
        client.release()
        return response_db
    }

    return ({
        getPosts: async (id_user, self = false) => {
            const query = `SELECT 
            p.id_post,
            p.likes,
            id_author,
            p.text,
            date_upload,
            u.username as username_author,
            u.url_avatar as url_avatar_author,
            array_agg(distinct mp.url_media) as media_links,
            array_agg(distinct lk.id_user) as likes,
            count(distinct cmt.id_comment) as countComments
            FROM posts p
            inner join users u on u.id_user = p.id_author
            left join media_post mp using(id_post) 
            left join likes lk on lk.id_post = p.id_post AND lk.state_like = TRUE
            left join comments cmt on cmt.id_post = p.id_post AND cmt.state_comment = TRUE 
            inner join account_settings ast on ast.id_user =  u.id_user
            WHERE  ast.state_account = TRUE  ${id_user ? `AND u.id_user = ${id_user} ${self ? '' : ` AND ast.view_private = FALSE AND p.state_post = TRUE`}` : ' AND p.state_post = TRUE'}
            group by p.id_post,id_author,p.text,date_upload,username_author,url_avatar_author,mp.id_post
            order by date_upload desc
            LIMIT 100;`
            const posts_found = await source(query)
            return posts_found.rows
        },
        insertPost: async (postData, media) => {
            const { query, values } = generateQuery('posts').insert(postData, ['id_post'])
            console.log(query, values);
            const post_insert = await source(query, values)//INSERT POST
            if (media) {
                //build query to insert all media
                const id_post_insert = post_insert.rows[0].id_post
                let values_to_insert = []
                const fields = ['id_post', ...Object.keys(media[0])]
                for (let object of media) {
                    const values = Object.values(object)
                    values_to_insert.push(`(${id_post_insert},'${values.join("','")}')`)
                }
                let query_media = `INSERT INTO media_post (${fields.join(', ')}) VALUES ${values_to_insert.join(',')}`
                await source(query_media)//INSERT MEDIA
            }
            return post_insert.rows[0]
        },
        updateDataPostById: async (id_post, data) => {
            const { query, values } = generateQuery('posts').update({ id_post }, data, ['id_post'])
            const resp_db = await source(query, values)
            return resp_db.rows[0]
        }
    })
}
