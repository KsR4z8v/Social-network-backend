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
        getUserByEmail: async (email) => {
            const user_found = await source('SELECT * from users where email = $1', [email])
            return user_found.rows[0]
        },
        getInfoUserById: async (id_user,) => {
            const { query, values } = generateQuery('users').select({ id_user }, ["fullname", "username", "phone_number", "email", "url_avatar", "date_born", "verify_code", "password", "user_bio"])
            // const user_found = await source('SELECT fullname,username,phone_number,email,url_avatar,date_born,verify_code,password,user_bio from users where id_user = $1', [id_user])
            console.log('QUERY GENERADA', query)
            const user_found = await source(query, values)
            return user_found.rows[0]
        },
        verifyIfExistUser: async (username, email) => {
            const { query, values } = generateQuery('users').select({ username, email }, ['username', 'email'])
            console.log('QUERY GENERADA', query)
            const user_found = await source(query, values)
            return user_found.rows[0]
        },
        getUser: async (filters, selectors) => {
            const { query, values } = generateQuery('users').select(filters, selectors)
            console.log('QUERY GENERADA', query, values);
            const user_found = await source(query, values)
            return user_found.rows[0]
        },
        insertUser: async (data) => {
            const { query, values } = generateQuery('users').insert(data)
            console.log(query, values);
            const user_insert = await source(query, values)
            return user_insert.rows[0]
        },
        updateDataUserById: async (id_user, data) => {
            const { query, values } = generateQuery('users').update(id_user, data)
            const resp_db = await source(query, values)
            console.log('query realizada', query)
            return resp_db.rows[0]
        }
    }
    )
}
