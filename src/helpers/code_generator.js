import crypto from 'crypto';


const generarCodigoVerificacion = (longitud)=> {
  const caracteresPermitidos = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let codigo = '';

  for (let i = 0; i < longitud; i++) {
    const indiceAleatorio = crypto.randomInt(0, caracteresPermitidos.length);
    codigo += caracteresPermitidos.charAt(indiceAleatorio);
  }

  return codigo;
}

export default generarCodigoVerificacion;
  
  
  