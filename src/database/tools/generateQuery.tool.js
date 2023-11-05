export const generateQuery = (id_user, data) => {
    const generate_payload = (type) => {
        const keys = [];
        const values = []
        let index = 1
        for (const i in data) {
            if (type === 'to_update') {
                keys.push(`${i} = ${'$' + index}`)
            }
            if (type === 'to_insert') {
                keys.push(`${"$" + index}`)
            }
            values.push(data[i])
            index++
        }
        values.push(id_user)
        return { keys, values }
    }

    return ({
        update: (table) => {
            const { keys, values } = generate_payload('to_update')
            console.log(keys, values);
            const query = `UPDATE ${table} SET  ${keys.join(', ')} WHERE id_user =${'$' + values.length} RETURNING id_user`
            return { query, values }
        },
        insert: (table) => {
            const { keys, values } = generate_payload('to_insert')
            values.pop()
            const query = `INSERT INTO ${table} (${Object.keys(data).join(', ')} ) VALUES (${keys.join(', ')}) RETURNING id_user`
            return { query, values }
        }

    })
}