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
        getUser: async (filters, selectors) => {
            const joins =
                ['JOIN account_settings ast using(id_user)',
                    'LEFT JOIN permissions per on ast.permission = per.id_permission']
            const { query, values } = generateQuery('users').select(filters, selectors, joins)
            console.log('QUERY GENERADA', query, values);
            const user_found = await source(query, values)
            return user_found.rows[0]
        },

        getRelationFriendsOfUser: async (id_user) => {
            const friends_found = await source(`select rf.id_relation, json_build_array(u1.id_user ,u1.username,u1.url_avatar) as user1,json_build_array(u2.id_user ,u2.username ,u2.url_avatar ) as user2
            from relation_friends rf
            join users u1  on  rf.id_user1 = u1.id_user
            join users u2 on rf.id_user2 = u2.id_user
            where id_user1 = $1 or id_user2 = $1`, [id_user])
            return friends_found.rows
        },

        sendFriendRequest : async (id_user1 ,id_user2)=>{
            const query = await source('INSERT INTO relation_friends (id_user1 , id_user2 , friend_state) VALUES ($1 ,$2 , $3)',[id_user1,id_user2 , 'pending']);
            return query;
        },

        insertUser: async (data) => {
            const { query, values } = generateQuery('users').insert(data, ['id_user'])
            console.log(query, values);
            const user_insert = await source(query, values)
            return user_insert.rows[0]
        },
        updateDataUserById: async (id_user, data) => {
            const { query, values } = generateQuery('users').update({ id_user }, data, ['id_user'])
            const resp_db = await source(query, values)
            console.log('query realizada', query)
            return resp_db.rows[0]
        },
        updateSettingsUserById: async (id_user, data) => {
            const { query, values } = generateQuery('account_settings').update({ id_user }, data, ['id_user'])
            const resp_db = await source(query, values)
            console.log('query realizada', query)
            return resp_db.rows[0]
        }
    }
    )
}
