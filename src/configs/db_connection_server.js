import pkg from 'pg'
const { Pool } = pkg
const pool = new Pool({
    connectionString: process.env.DB_URI_SERVER,
    max: 97,
    ssl: true,
    idleTimeoutMillis: 0
})

pool.on("connect", function (connection) {
    // evento cuando se crea una nueva conexion
    console.log(new Date(), `✔️ SnapWire: Created new client,count:  ${pool.totalCount}`)
    connection.on('error', function (err) {
        console.log('Error in the client', err.message);
    })
});
pool.on("error", function (err) {
    console.log(` ERROR in the pool: ${err.message} `);
});

pool.on("acquire", function (connection) {
    //evento cuando se obtiene una conexion existente
    console.log(" Connection has been acquired: SERVER", pool.totalCount);
});

pool.on("release", function (connection) {
    //console.log(" Connection has been released");
});


export default pool