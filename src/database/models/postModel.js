
import { generateQuery } from '../tools/generateQuery.tool.js'
import dbConnectionManagement from '../dbConnectionManagement.js';

export default (pools) => {
    return ({
        getPosts: async (filters, self = false) => {
            let index = 1
            const indexKeys = {}
            let params = []
            for (let key in filters) {
                if (filters[key]) {
                    indexKeys[key] = index
                    params.push(key === 'querySearch' ? `%${filters[key]}%` : filters[key])
                    index += 1
                }
            }

            const preQueryDate = `
                        SELECT date_upload 
                        FROM posts p
                        inner join users u on u.id_user = p.id_author
                        inner join account_settings ast on ast.id_user =  u.id_user
                        WHERE  ast.state_account = TRUE AND p.id_post = $${indexKeys.id_post_cursor}
                        `
            const query = `SELECT 
                        p.id_post,
                        id_author,
                        p.text,
                        date_upload,
                        ${self ? 'p.post_visibility,' : ''}
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
                        WHERE  ast.state_account = TRUE  AND p.post_status = TRUE AND p.post_visibility = TRUE
                        ${filters.id_user ? `AND u.id_user = $${indexKeys.id_user} ${self ? '' : ` AND ast.view_private = FALSE`}` : ''}
                        ${filters.id_post_cursor ? ` AND p.date_upload < (${preQueryDate}) ` : ''}
                        ${filters.querySearch ? `AND (p.text ilike $${indexKeys.querySearch} OR u.username ilike $${indexKeys.querySearch}  OR u.fullname ilike $${indexKeys.querySearch})` : ''}
                        group by p.id_post,id_author,p.text,date_upload,username_author,url_avatar_author,mp.id_post
                        order by date_upload desc
                        LIMIT 10;`
            const posts_found = await dbConnectionManagement(pools, query, params)
            return posts_found.rows
        },
        getPostById: async (id_post) => {
            const query = `SELECT 
                            id_author,
                            id_post,
                            array_agg(distinct mp.url_media) as media_links
                            FROM posts 
                            left join media_post mp using(id_post)
                            WHERE id_post = $1 AND post_status = TRUE
                            group by id_author, id_post`

            const resp_db = await dbConnectionManagement(pools, query, [id_post])
            return resp_db.rows[0]
        },
        insertReport: async (reportData) => {
            const { query, values } = generateQuery('reports').insert(reportData, ['id_report']);
            const report_inserted = await dbConnectionManagement(pools, query, values, false);
            return report_inserted.rows[0]
        },
        insertPost: async (postData) => {
            const { query, values } = generateQuery('posts').insert(postData, ['id_post'])
            const post_inserted = await dbConnectionManagement(pools, query, values, false)//INSERT POST
            return post_inserted.rows[0]
        },
        insertMedia: async (id_post, media) => {
            let values_to_insert = []
            const fields = ['id_post', ...Object.keys(media[0])]
            for (let object of media) {
                const values = Object.values(object)
                values_to_insert.push(`(${id_post},'${values.join("','")}')`)
            }
            let query_media = `INSERT INTO media_post (${fields.join(', ')}) VALUES ${values_to_insert.join(',')}`
            await dbConnectionManagement(pools, query_media, false)//INSERT MEDIA
        },
        updateDataPostById: async (id_post, data) => {
            const { query, values } = generateQuery('posts').update({ id_post }, data, ['id_post'])
            console.log(query);
            const resp_db = await dbConnectionManagement(pools, query, values, false)
            return resp_db.rows[0]
        }
    })
}
