import pkg from 'pg'
const { Pool } = pkg

import config from './config.js'
const pool = new Pool(config.db_pool_config_dev)

pool.on("connect", function (connection) {
    // evento cuando se crea una nueva conexion
    console.log(new Date(), `✔️ SnapWire: Created new client,count:  ${pool.totalCount}`)
    connection.on('error', function (err) {
        console.log('Error in client');
    })
});
pool.on("error", function (err) {
    console.log(` ERROR: ${err.message} `);
});

pool.on("acquire", function (connection) {
    // evento cuando se obtiene una conexion existente
    //console.log(" Connection has been acquired", pool.totalCount);
});

pool.on("release", function (connection) {
    //console.log(" Connection has been released");
});

export default pool