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
        getUserByEmail: async (email) => {
            const user_found = await source('SELECT * from users where email = $1', [email])
            return user_found.rows[0]
        },
        getInfoUserById: async (id_user) => {
            const user_found = await source('SELECT fullname,username,phone_number,email,url_avatar,date_born,verify_code from users where id_user = $1', [id_user])
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
        updateStateToActive: async (id_user) => {
            const user_found = await source('UPDATE users SET state_account = $1 , is_verified = $1  where id_user = $2', [true, id_user])
            return user_found.rows
        },
        updateDataUserById: async (id_user, fullname, username, phone_number, email, date_born) => {
            const user_found = await source(`UPDATE users SET 
            fullname=$1 , username=$2 , phone_number=$3 , email=$4, date_born=$5 WHERE id_user=$6 RETURNING id_user`,
                [fullname, username, phone_number, email, date_born, id_user])
            return user_found.rows
        },
        updateAvatarUserByIdUser: async (id_user, url_avatar) => {
            const user_found = await source(`UPDATE users SET url_avatar=$1 WHERE id_user=$2 RETURNING id_user`, [url_avatar, id_user])
            return user_found.rows
        },
        passwordUpdate: async (id_user, new_password) => {
            const user_found = await source(`UPDATE users SET password=$1 WHERE id_user = $2 RETURNING id_user`, [new_password, id_user])
            return user_found.rows
        },
        getPasswordUserById: async (id_user) => {
            const user_found = await source('SELECT password from users where id_user = $1', [id_user])
            return user_found.rows[0]
        }

    }
    )
}
