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

        //likes a publicaciones

        verifyLike: async (id_user, id_post)=>{
            const like = await source(`SELECT id_like from likes WHERE id_post = $1 AND id_user = $2` , [id_post, id_user])
            return like.rows[0];
        },

        addLike : async(id_user, id_post)=>{
            const addlike = await source('INSERT INTO likes (id_user , id_post) values ($1 , $2)' , [id_user,id_post]);
            return addlike.rows[0];
        },

        removeLike : async (id_user , id_post) =>{
            const unlike = await source('DELETE FROM likes WHERE id_user = $1 AND id_post = $2' , [id_user, id_post]);
            return unlike.rows[0];
        },

        getLikesbyPost: async (id_post)=>{
            const numlikes = await source(`SELECT likes from post WHERE id_post = $1` , [id_post]);
            return parseInt(numlikes.rows[0].likes, 10);
        },

        // comentarios a publicaciones
        
        getCommentByid : async(id_comment) =>{
            const query =` SELECT * from comments WHERE id_comment = $1 RETURNING *`;
            const comment = await source(query , [id_comment]);
            return comment.rows[0];
        },
        
        getCommentsbyPost : async (id_post)=>{
            const query =` SELECT c.id_comment , c.id_user, c.post c.text , c.date FROM comment c JOIN post ON c.post = post.id_post WHERE c.comment_state = true AND post.state_post = true AND post.id_post = $1`
            const comments =  await source(query , [id_post]);
            return comments.rows;
        },

        addComment : async (commentData) =>{
            const { query, values } = generateQuery('comment').insert(commentData, ['id_comment']);
            const comment_insert = await source(query, values);
            return comment_insert.rows
        },
        editComment: async function editComment(id_comment, newText, newDate) {
            try {
                const query = 'UPDATE comments SET text = $1 , date = $2 WHERE id_comment = $3';
                const comment_edit = await source(query, [newText, newDate, id_comment]);
                return comment_edit;
            } catch (error) {
                console.error('Error al editar el comentario:', error);
            }
        },
        deleteComment : async (id_comment)=>{
            try {
                const query = 'UPDATE comments SET comment_state = false WHERE id_comment = $1';
                const comment_delete = await source(query, [id_comment]);
                return comment_delete;
            } catch (error) {
                console.error('Error al eliminar el comentario:', error);
            }

        }
    });
}