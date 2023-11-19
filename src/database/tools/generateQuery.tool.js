export const generateQuery = (table) => {
    const generate_payload = (type, data) => {
        const keys = [];
        const values = []
        let index = 1
        for (const i in data) {
            if (type === 'to_update' || type === 'to_select') {
                keys.push(`${i} = ${'$' + index}`)
            }
            if (type === 'to_insert') {
                keys.push(`${"$" + index}`)
            }
            values.push(data[i])
            index++
        }
        return { keys, values }
    }
    return ({
        update: (condition, data, returns) => {
            const { keys, values } = generate_payload('to_update', data)
            const key_condition = Object.keys(condition)[0]
            values.push(condition[key_condition])
            const query = `UPDATE ${table} SET  ${keys.join(', ')} WHERE ${key_condition}=${"$" + values.length} RETURNING ${returns.join(',')}`
            return { query, values }
        },
        insert: (data, returns) => {
            const { keys, values } = generate_payload('to_insert', data)
            const query = `INSERT INTO ${table} (${Object.keys(data).join(', ')} ) VALUES (${keys.join(', ')}) RETURNING ${returns.join(',')}`
            return { query, values }
        },
        select: (filters, selectors, joins) => {
            const { keys, values } = generate_payload('to_select', filters)
            const query = `SELECT ${selectors.join(',')} FROM ${table} ${joins.join(' ')} WHERE ${keys.join(' or ')}`
            return { query, values }
        }
    })
}