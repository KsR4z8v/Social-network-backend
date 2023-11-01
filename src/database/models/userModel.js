
export default (pool) => ({
    getUserByEmail: async (email) => {
        const client = await pool.connect()
        const user_found = await client.query('SELECT * from users where email = $1', [email])
        client.release()
        return user_found.rows[0]
    },
    getUserById: async (id_user) => {
        const client = await pool.connect()
        const user_found = await client.query('SELECT password from users where id_user = $1', [id_user])
        client.release()
        return user_found.rows[0]
    },
    updateAvatarUserByIdUser: async (id_user, url_avatar) => {
        const client = await pool.connect()
        const resp_db = await client.query(`UPDATE users SET url_avatar=$1 WHERE id_user=$2 RETURNING id_user`, [url_avatar, id_user])
        client.release()
        return resp_db.rows[0]
    },

    dataUpdate: async (id_user, fullname, username, phone_number, email, date_born) => {
        const client = await pool.connect()
        const resp_db = await client.query(`UPDATE users SET fullname=$1 , username=$2 , phone_number=$3 , email=$4, date_born=$5 WHERE id_user=$6 RETURNING id_user`, [fullname, username, phone_number, email, date_born, id_user])
        client.release()
        return resp_db

    },
    passwordUpdate: async (id_user, new_password) => {
        const client = await pool.connect()
        const resp_db = await client.query(`UPDATE users SET password=$1 WHERE id_user = $2 RETURNING id_user`, [new_password, id_user])
        client.release()
        return resp_db

    }
})