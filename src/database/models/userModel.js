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
