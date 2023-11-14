import dotenv from 'dotenv'
dotenv.config()

export default (pool) => {
    const source = async (query, params) => {
        const client = await pool.connect()
        const response_db = await client.query(query, params)
        client.release()
        return response_db
    }

    return ({

        verifyLike: async (id_user, id_post)=>{
            const like = await source(`SELECT id_like from likes WHERE id_post = $1 AND id_user = $2` , [id_post, id_user])
            return like.rows[0]
        },

        addLike : async(id_user, id_post)=>{
            const addlike = await source('INSERT INTO likes values ($1 , $2)' , [id_user,id_post]);
            return addlike.rows[0]
        },

        removeLike : async (id_user , id_post) =>{
            const unlike = await source('DELETE FROM likes WHERE id_user = $1 AND id_post = $2' , [id_user, id_post]);
            return unlike.rows[0]
        },

        getLikesbyPost: async (id_post)=>{
            const numlikes = await source(`SELECT likes from post WHERE id_post = $1` , [id_post]);
            return parseInt(numlikes.rows[0].likes, 10)
        }
    })
}