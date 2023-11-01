import { google } from 'googleapis'
import dotenv from 'dotenv'
dotenv.config()
const oAuth2Client = new google.auth.OAuth2(process.env.ID_CLIENT, process.env.SECRET_CLIENT);
oAuth2Client.setCredentials({
    refresh_token: process.env.REFRES_TOKEN_API
});
const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });


const sendEmailVerification = async (name, code, email) => {
    const message = "From: 'Tu Nombre' <example@gmail.com>\n" +
        `To: ${email}\n` +
        `Subject:Codigo de verifacion de SnapWire\n\n` +
        `Hola ${name} ! Tu código de verificación es:  ${code}`;

    return new Promise((resolve, reject) => {
        gmail.users.messages.send({
            userId: 'me',
            resource: {
                raw: Buffer.from(message).toString('base64')
            }
        }, (err, res) => {
            if (err) {
                reject(err)
                return console.log('Error al enviar el correo:', err);
            }
            console.log('Correo enviado correctamente:', res.data);
            resolve(res.data)
        });
    })


}
export default sendEmailVerification




