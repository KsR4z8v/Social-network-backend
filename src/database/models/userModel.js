
export default (pool) => ({
    getUserByEmail: async (email) => {
        const client = await pool.connect()
        const user_found = await client.query('SELECT * from users where email = $1', [email])
        client.release()
        return user_found.rows[0]
    },
})