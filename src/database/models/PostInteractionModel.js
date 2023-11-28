import { generateQuery } from '../tools/generateQuery.tool.js'
import dbConnectionManagement from '../dbConnectionManagement.js';
export default (pools) => {


    return ({
        //likes a publicaciones
        verifyLike: async (id_user, id_post) => {
            const query = `SELECT id_like,state_like from likes WHERE id_post = $1 AND id_user = $2`
            const like = await dbConnectionManagement(pools, query, [id_post, id_user])
            return like.rows[0];
        },
        getInfoLikesPost: async (id_post) => {
            const query = `SELECT id_like,json_build_array(u.id_user,u.username,u.url_avatar) as user
            FROM likes lk
            join users u using (id_user)
            join posts p using(id_post)
            join account_settings acs using(id_user)
            WHERE lk.state_like = TRUE AND  p.post_status = TRUE AND acs.state_account = TRUE 
            AND id_post = $1;`
            const resp_db = await dbConnectionManagement(pools, query, [id_post])
            return resp_db.rows;
        },
        updateStateLike: async (id_user, id_post, state_like) => {
            const query = `UPDATE likes set state_like = ${state_like} WHERE id_user = $1 AND id_post = $2`
            const resp_db = await dbConnectionManagement(pools, query, [id_user, id_post], false)
            return resp_db.rows[0]
        },
        insertRelationLike: async (id_user, id_post) => {
            const query = 'INSERT INTO likes (id_user,id_post) VALUES($1,$2)'
            const resp_db = await dbConnectionManagement(pools, query, [id_user, id_post], false)
            return resp_db.rows[0]
        },

        // comentarios a publicaciones
        getCommentByid: async (id_comment) => {
            const query = ` SELECT * from comments WHERE id_comment = $1 RETURNING *`;
            const comment = await dbConnectionManagement(pools, query, [id_comment]);
            return comment.rows[0];
        },

        getCommentsbyPost: async (id_post) => {
            const query = ` SELECT c.id_comment , c.id_user, c.id_post ,c.text , c.date_created,u.username,u.url_avatar
                            FROM comments c 
                            JOIN posts p using(id_post) 
                            JOIN users u using(id_user)
                            JOIN account_settings acs using(id_user)
                            WHERE  acs.state_account = TRUE AND c.state_comment = TRUE AND p.post_status = TRUE AND p.id_post = $1
                            order by c.date_created desc`
            const comments = await dbConnectionManagement(pools, query, [id_post]);
            return comments.rows;
        },
        addComment: async (commentData) => {
            const { query, values } = generateQuery('comments').insert(commentData, ['id_comment']);
            const comment_insert = await dbConnectionManagement(pools, query, values, false);
            return comment_insert.rows
        },
        editComment: async function editComment(id_comment, newText, newDate) {
            try {
                const query = 'UPDATE comments SET text = $1 , date = $2 WHERE id_comment = $3';
                const comment_edit = await dbConnectionManagement(pools, query, [newText, newDate, id_comment], false);
                return comment_edit;
            } catch (error) {
                console.error('Error al editar el comentario:', error);
            }
        },
        deleteComment: async (id_comment) => {
            try {
                const query = 'UPDATE comments SET comment_state = false WHERE id_comment = $1';
                const comment_delete = await dbConnectionManagement(pools, query, [id_comment], false);
                return comment_delete;
            } catch (error) {
                console.error('Error al eliminar el comentario:', error);
            }

        }
    });
}