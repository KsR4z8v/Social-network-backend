import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

const config_oauth2 = () => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.ID_CLIENT,
    process.env.SECRET_CLIENT
  );
  oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN_API,
  });
  return oAuth2Client;
};

const messageVerifyCode = (name: string, code: string) => `
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
`;

const resetPasswordLink = (name: string, accessToken: string) => ` 
<html>
    <h1 text-align:center; style="font-size: 60px;margin: 20px;font-family: 'IBM Plex Sans', sans-serif;font-family: 'Satisfy', cursive;font-weight: 900;">SnapWire</h1>
    <body style="font-family: Arial, sans-serif; color: #333333; background-color: #f2f2f2; padding: 20px;">
        <h1 style="color: #0066cc;">Hola ! ${name} 🖐️</h1>
        <p style="font-size: 16px;">Recupera tu contraseña </p>
        <a href="${process.env.SECURE_URL_RESET_PASSWORD}/${accessToken}" ><div id="button_confirm" style="height:min-content; width:100%; background-color: #1399f3; color:white; text-align:center; font-size:20px"> <b>RESTABLECER CONTRASEÑA</b></div></a>
        <p style="font-size: 14px;">...</p>
        <p style="font-size: 12px; color: #999999;">SnapWire</p>
    </body> 
</html>`;

const sendEmail = (email: string, name: string) => {
  const oAuth2Client = config_oauth2();
  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
  const resource = async (messageType: string, subject: string) => {
    const encodedSubject = Buffer.from(subject).toString("base64");

    const emailContent: string = [
      "From: snapwire.info@gmail.com",
      `To: ${email}`,
      `Subject: =?utf-8?B?${encodedSubject}?=`,
      'Content-Type: text/html; charset="UTF-8"',
      "",
      messageType,
    ].join("\r\n");

    return new Promise((resolve, reject) => {
      gmail.users.messages.send(
        {
          userId: "me",
          requestBody: {
            raw: Buffer.from(emailContent).toString("base64"),
          },
        },
        (err, res) => {
          if (err) {
            console.log(err.message);
            return console.log("Error al enviar el correo");
          }
          console.log("Correo enviado correctamente:", res?.data);
          resolve(res?.data);
        }
      );
    });
  };

  return {
    verificationEmail: async (code: string) => {
      return await resource(
        messageVerifyCode(name, code),
        "Codigo de verificacion"
      );
    },
    resetPasswordLink: async (accessToken: string) => {
      return await resource(
        resetPasswordLink(name, accessToken),
        "Restablecer contraseña"
      );
    },
  };
};
export default sendEmail;
