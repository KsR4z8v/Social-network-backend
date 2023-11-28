
import backOff from "../helpers/backOff.js"

const dbConnectionManagement = async (pools, query, params, modeRead = true) => {
    const exec = async (pool) => {
        const client = await pool.connect()
        const resp_db = await client.query(query, params)
        client.release()
        return resp_db
    }
    //intenta obtener una respuesta de los servidores configurados
    let i = 0;
    for (const p of pools) {
        try {
            if (i === 0) {//pool principal 
                //console.log(query);
                return await exec(p)
            }
            if (i > 0 && modeRead) {
                const resp_back = await backOff(
                    async () => {
                        return await exec(p)
                    },
                    { increment: '1s' }, 5)

                if (resp_back && typeof resp_back !== 'string') return resp_back
            }
        } catch (e) {
            console.log(e);
            if (!modeRead) throw new Error('Error al ejecutar la operacion en la primera base de datos');;
        }
        i += 1
    }
    throw new Error('Error al ejecutar la operacion en las bases de datos');
}

export default dbConnectionManagement