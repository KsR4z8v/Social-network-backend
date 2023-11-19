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

        verifyLike: async (id_user, id_post) => {
            const like = await source(`SELECT id_like,state_like from likes WHERE id_post = $1 AND id_user = $2`, [id_post, id_user])
            return like.rows[0];
        },

        updateStateLike: async (id_user, id_post, state_like) => {
            const resp_db = await source(`UPDATE likes set state_like = ${state_like} WHERE id_user = $1 AND id_post = $2`, [id_user, id_post])
            return resp_db.rows[0]
        },
        insertRelationLike: async (id_user, id_post) => {
            const resp_db = await source('INSERT INTO likes (id_user,id_post) VALUES($1,$2)', [id_user, id_post])
            return resp_db.rows[0]
        },

        // comentarios a publicaciones
        getCommentByid: async (id_comment) => {
            const query = ` SELECT * from comments WHERE id_comment = $1 RETURNING *`;
            const comment = await source(query, [id_comment]);
            return comment.rows[0];
        },

        getCommentsbyPost: async (id_post) => {
            const query = ` SELECT c.id_comment , c.id_user, c.id_post ,c.text , c.date_created,u.username,u.url_avatar
                            FROM comments c 
                            JOIN posts p using(id_post) 
                            JOIN users u using(id_user)
                            JOIN account_settings acs using(id_user)
                            WHERE  acs.state_account = TRUE AND c.state_comment = TRUE AND p.state_post = TRUE AND p.id_post = $1`
            const comments = await source(query, [id_post]);
            return comments.rows;
        },

        addComment: async (commentData) => {
            const { query, values } = generateQuery('comments').insert(commentData, ['id_comment']);
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
        deleteComment: async (id_comment) => {
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