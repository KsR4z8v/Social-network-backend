export const generateQueryUpdate = (id_user, data) => {
    const keys_to_update = [];
    const values_to_update = []
    let index = 1
    for (const i in data) {
        keys_to_update.push(`${i} = ${'$' + index}`)
        values_to_update.push(data[i])
        index++
    }
    values_to_update.push(id_user)
    const query = `UPDATE users SET  ${keys_to_update.join(', ')} WHERE id_user =${'$' + values_to_update.length} RETURNING id_user`
    return {
        query, values_to_update
    }
}