const db_pool_config_dev = {
    host: 'localhost',
    password: 'root',
    user: 'postgres',
    database: 'Snap-wire-dev',
    port: 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
}


const config_cors = {
    origin: '*',
}
export default {
    db_pool_config_dev,
    config_cors
}