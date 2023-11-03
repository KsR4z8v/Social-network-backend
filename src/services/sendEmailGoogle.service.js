import { google } from 'googleapis'
import dotenv from 'dotenv'
dotenv.config()
const oAuth2Client = new google.auth.OAuth2(process.env.ID_CLIENT, process.env.SECRET_CLIENT);
oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN_API
});
const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

const menssageVerifyCode = (name, code) => `
<html>
  <h1 text-align:center; style="font-size: 60px;margin: 20px;font-family: 'IBM Plex Sans', sans-serif;font-family: 'Satisfy', cursive;font-weight: 900;">SnapWire</h1>
  <body style="font-family: Arial, sans-serif; color: #333333; background-color: #f2f2f2; padding: 20px;">
    <h1 style="color: #0066cc;">Hola ! ${name} 🖐️</h1>
    <p style="font-size: 16px;">Este es tu codigo de verificacion :</p>
    <div style="height:min-content; width:100%; background: white; color:black; text-align:center; font-size:30px"> <b>${code}</b></div>
    <p style="font-size: 14px;">recuerda que no debes compartir este codigo con nadie.</p>
    <p style="font-size: 12px; color: #999999;">SnapWire</p>
  </body>
</html>
`

const resetPasswordLink = (name) => ` 
<html>
    <h1 text-align:center; style="font-size: 60px;margin: 20px;font-family: 'IBM Plex Sans', sans-serif;font-family: 'Satisfy', cursive;font-weight: 900;">SnapWire</h1>
    <body style="font-family: Arial, sans-serif; color: #333333; background-color: #f2f2f2; padding: 20px;">
        <h1 style="color: #0066cc;">Hola ! ${name} 🖐️</h1>
        <p style="font-size: 16px;">Recupera tu contraseña </p>
        <a href= "https://google.com"><div id="button_confirm" style="height:min-content; width:100%; background-color: #1399f3; color:white; text-align:center; font-size:20px"> <b>RESTABLECER CONTRASEÑA</b></div></a>
        <p style="font-size: 14px;">si tu no estas intenta cambiar tu contraseña llorelo papa, se lo estan hackeando</p>
        <p style="font-size: 12px; color: #999999;">SnapWire</p>
    </body> 
</html>`

const sendEmail = (email, name) => {
    const resorce = async (messageType, asunto) => {
        const message = `From: sender@example.com\r\nTo: ${email}\r\nSubject: ${asunto}\r\nContent-Type: text/html; charset=utf-8\r\n\r\n${messageType}`
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

    return ({
        verificationEmail: async (code) => {
            return await resorce(menssageVerifyCode(name, code), "Codigo de verificacion")
        },
        resetPasswordLink: async () => {
            return await resorce(resetPasswordLink(name), "Restablecer contraseña")
        }
    })
}
export default sendEmail




