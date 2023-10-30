
import {pool} from '../db.js';


export const addToDatabase = async (name,lastname, password, avatar ,creationDate, email, username, state)=>{
 
    try{
        const connection = await pool.getConnection();
        const [usuario_insertado] = await connection.query('INSERT INTO usuarios (nombre,apellido,contrasena,avatar,fecha_creacion, email,username,estado) VALUES (?,?,?,?,?,?,?,?);', [name, lastname, password, avatar, creationDate, email, username, state]);
        connection.release();

        return usuario_insertado;
    
    }catch(err){
        throw new Error(err);
    }

}

export const findByAttribute = async (select, attribute, value) =>{
    try{
        const connection = await pool.getConnection();
        const [result] = await pool.query(`SELECT ${select} FROM usuarios WHERE ${attribute} = ?` , [value]);
        connection.release();

        return result;

    }catch(err){
        throw new Error(err);
    }
}

export const updateStateToActive = async (id_user)=>{
    try{
        const connection = await pool.getConnection();
        await connection.query('UPDATE usuarios SET estado = "Active" where id_usuario = ?' , [id_user]);
        connection.release();
    }catch(err){
        throw new Error(err);
    }
}