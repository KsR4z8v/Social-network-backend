
import sendMail from '../helpers/send_email.js' ;
import codeGenerator from '../helpers/code_generator.js';
import bcrypt from '../helpers/encrypt.js';
import {addToDatabase, updateStateToActive, findByAttribute} from '../model/bdconsultas.js';





export const signUpController = async (req,res) =>{
    
    let {username, correoElectronico, password, name, lastname, avatar} = req.body;

    const consultaEmail = await findByAttribute("*","email", correoElectronico);

    if(consultaEmail.length > 0){
        return res.status(409).json({text: 'El correo electrónico ya está registrado'});
    }
    else if (password.length < 5){
        return res.status(400).json({text: 'La contraseña debe tener como mínimo 5 caracteres'});
    }
    else if(! /\d/.test(password)){
        return res.status(400).json({text: 'La contraseña debe contener almenos un caracter numérico'});
    }

    
    const codigoVerificacion = codeGenerator(10);
    
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    lastname = lastname.charAt(0).toUpperCase() + lastname.slice(1).toLowerCase();
    password = await bcrypt(password);
    const fecha_creacion = new Date();

    //el atributo estado toma el valor del codigo hasta que se confirme
    const estado = codigoVerificacion;
    
    
    const usuario = await addToDatabase(name,lastname,password, avatar , fecha_creacion, correoElectronico, username, estado);
    const usuarioID = usuario.insertId;    
    sendMail(codigoVerificacion, correoElectronico);

    res.redirect(`/signup/confirmEmail/${usuarioID}`);
}


export const confirmEmailController = async (req,res)=>{
    const{id_usuario} = req.params;
    const{codigo_ingresado} = req.body;
    

    const usuario = await findByAttribute("estado", "id_usuario" , id_usuario);
    const codigo_usuario = usuario[0].estado;
    
    
    if(codigo_usuario != codigo_ingresado){
        return res.status(400).json({text: 'Código de verificación incorrecto. Por favor verifique su correo e intentelo de nuevo.'})
    }else{
        await updateStateToActive(id_usuario);
        res.status(200).json({text:'Usuario registrado'});
    }
    
}





