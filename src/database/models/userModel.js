import dotenv from 'dotenv'
import { generateQueryUpdate } from '../tools/generateQueryUpdate.tool.js'
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
            const user_found = await source('SELECT fullname,username,phone_number,email,url_avatar,date_born,verify_code,password from users where id_user = $1', [id_user])
            return user_found.rows[0]
        },
        verifyIfExistUser: async (username, email) => {
            const user_found = await source('SELECT username,email from users where email = $1 or username= $2', [email, username])
            return user_found.rows[0]
        },
        insertUser: async (username, password, email, fullname, phone_number, date_created, date_born, verify_code) => {
            const user_found = await source(`INSERT INTO  users 
        (username,email,password,fullname,phone_number,date_created,date_born,verify_code,url_avatar)
                VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id_user`,
                [username, email, password, fullname, phone_number, date_created, date_born, verify_code, process.env.AVATAR_DEFAULT])
            return user_found.rows[0].id_user
        },
        updateDataUserById: async (id_user, data) => {
            const { query, values_to_update } = generateQueryUpdate(id_user, data)
            const resp_db = await source(query, values_to_update)
            console.log('query realizada', query)
            return resp_db.rows[0]
        }


    }
    )
}
