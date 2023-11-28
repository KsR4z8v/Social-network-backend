import pkg from 'pg'
const { Pool } = pkg
const pool = new Pool({
    max: 97,
    port: 5432,
    host: 'localhost',
    database: 'snapwire_dev',
    password: 'root',
    user: 'snapwire_user',
    idleTimeoutMillis: 0
})

pool.on("connect", function (connection) {
    // evento cuando se crea una nueva conexion
    console.log(new Date(), `✔️ SnapWire: Created new client LOCAL ,count:  ${pool.totalCount}`)
    connection.on('error', function (err) {
        console.log('Error in the client LOCAL', err.message);
    })
});
pool.on("error", function (err) {
    console.log(` ERROR in the pool LOCAL: ${err.message} `);
});

pool.on("acquire", function (connection) {
    //evento cuando se obtiene una conexion existente
    console.log(" Connection has been acquired: LOCAL", pool.totalCount);
});

pool.on("release", function (connection) {
    //console.log(" Connection has been released");
});


export default pool