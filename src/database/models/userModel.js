import dbConnectionManagement from '../dbConnectionManagement.js'
import { generateQuery } from '../tools/generateQuery.tool.js'

export default (pools) => {
    return ({
        getUser: async (filters, selectors) => {
            const joins =
                ['JOIN account_settings ast using(id_user)',
                    'LEFT JOIN permissions per on ast.permission = per.id_permission']
            const { query, values } = generateQuery('users').select(filters, selectors, joins)
            // console.log('QUERY GENERADA', query, values);
            const user_found = await dbConnectionManagement(pools, query, values)
            return user_found.rows[0]
        },

        getRelationFriendsOfUser: async (id_user, foreign = false) => {
            const resp_db = await dbConnectionManagement(pools, `select rf.id_relation, json_build_array(u1.id_user ,u1.username,u1.url_avatar) as user1,json_build_array(u2.id_user ,u2.username ,u2.url_avatar ) as user2, friend_state,user_requesting
            from relation_friends rf
            join users u1  on  rf.user1 = u1.id_user
            join users u2 on rf.user2 = u2.id_user
            where (rf.user1 = $1 or rf.user2 = $1) ${foreign ? `AND rf.friend_state = 'accepted'` : ``} `, [id_user])
            return resp_db.rows
        },
        verifyRequestFriend: async (id_user, to_user) => {
            const query = `SELECT id_relation,user_requesting,friend_state FROM relation_friends WHERE (user1 = $1 AND user2 = $2)  OR  (user1 = $2 AND user2 = $1)`
            const resp_db = await dbConnectionManagement(pools, query, [to_user, id_user])
            return resp_db.rows[0]
        }
        ,
        sendFriendRequest: async (id_user1, id_user2) => {
            const query = 'INSERT INTO relation_friends (user1 , user2 , user_requesting) VALUES ($1 ,$2 , $3) RETURNING id_relation'
            const resp_db = await dbConnectionManagement(pools, query, [id_user1, id_user2, id_user1], false);
            return resp_db.rows[0];
        },
        acceptRequestFriend: async (id_relation) => {
            const { query, values } = generateQuery('relation_friends').update({ id_relation }, { friend_state: 'accepted' }, ['id_relation'])
            const resp_db = await dbConnectionManagement(pools, query, values, false)
            return resp_db.rows[0]
        },
        deleteFriend: async (id_relation) => {
            const query = 'DELETE from relation_friends WHERE id_relation=$1  RETURNING id_relation'
            const resp_db = await dbConnectionManagement(pools, query, [id_relation], false)
            return resp_db.rows[0]
        },
        deleteRequest: async (id_user1, id_user2) => {
            const query = `DELETE from relation_friends WHERE ((user1 = $1 AND user2 = $2) OR (user1 = $2 AND user2 = $1) ) AND (friend_state = 'pending')  RETURNING id_relation`
            const resp_db = await dbConnectionManagement(pools, query, [id_user1, id_user2], false)
            return resp_db.rows[0]
        },
        insertUser: async (data) => {
            const { query, values } = generateQuery('users').insert(data, ['id_user'])
            const user_insert = await dbConnectionManagement(pools, query, values)
            return user_insert.rows[0]
        },
        updateDataUserById: async (id_user, data) => {
            const { query, values } = generateQuery('users').update({ id_user }, data, ['id_user'])
            const resp_db = await dbConnectionManagement(pools, query, values, false)
            return resp_db.rows[0]
        },
        updateSettingsUserById: async (id_user, data) => {
            const { query, values } = generateQuery('account_settings').update({ id_user }, data, ['id_user'])
            const resp_db = await dbConnectionManagement(pools, query, values, false)
            return resp_db.rows[0]
        }
    }
    )
}
