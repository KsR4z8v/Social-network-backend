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
        // getLikes: async(id_post)=>{
        //     const query = 

        // },
        getPosts: async (id_user) => {
            const query = `select p.id_post,id_author,text,date_upload,u.username as username_author,u.url_avatar as url_avatar_author,array_agg(mp.url_media) as media_links
            from posts p
            join users u on u.id_user = p.id_author
            left join media_post mp using(id_post) 
            WHERE  u.state_account = TRUE ${id_user ? `AND u.id_user = ${id_user}` : ''}
            group by p.id_post,id_author,text,date_upload,username_author,url_avatar_author,mp.id_post
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
            const { query, values } = generateQuery('posts').update(id_post, data, ['id'])
            console.log('query: ',query, values)
            // const resp_db = await source(query, values)
            // return resp_db.rows[0]
        }
    }
    )
}
