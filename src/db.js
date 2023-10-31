
import {createPool} from 'mysql2/promise';

export const pool = createPool({
    host : 'localhost',
    user : 'root',
    password: 'mauricio',
    port : 3306,
    database : 'snapwire'
});





