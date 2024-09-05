import crypto from "crypto";

const generateVerificationCode = (size: number): string => {
  const caracteresPermitidos = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let codigo = "";

  for (let i = 0; i < size; i++) {
    const indiceAleatorio = crypto.randomInt(0, caracteresPermitidos.length);
    codigo += caracteresPermitidos.charAt(indiceAleatorio);
  }

  return codigo;
};

export default generateVerificationCode;
