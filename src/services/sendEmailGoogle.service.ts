import { Auth, gmail_v1, google } from "googleapis";

export default class ApiGoogleEmailService {
  private oAuth2Client: Auth.OAuth2Client;
  private static instance: ApiGoogleEmailService;

  constructor(
    id_client?: string,
    secret_client?: string,
    access_token?: string
  ) {
    this.oAuth2Client = new google.auth.OAuth2(id_client, secret_client);
    this.oAuth2Client.setCredentials({ access_token });
    if (ApiGoogleEmailService.instance) {
      return ApiGoogleEmailService.instance;
    }
    ApiGoogleEmailService.instance = this;
    return this;
  }

  static getInstance(): ApiGoogleEmailService {
    return this.instance;
  }

  private async sendMail(
    email: string,
    subject: string,
    body: any
  ): Promise<void> {
    const gmail: gmail_v1.Gmail = google.gmail({
      version: "v1",
      auth: this.oAuth2Client,
    });

    const encodedSubject = Buffer.from(subject).toString("base64");
    const emailContent: string = [
      "From: snapwire.info@gmail.com",
      `To: ${email}`,
      `Subject: =?utf-8?B?${encodedSubject}?=`,
      'Content-Type: text/html; charset="UTF-8"',
      "",
      body,
    ].join("\r\n");

    try {
      await gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: Buffer.from(emailContent).toString("base64"),
        },
      });
      console.log("correo enviado!");
    } catch (e) {
      console.log("Error al enviar el correo");
    }
  }

  async sendVerificationCode(email: string, name: string, code: string) {
    const html = `<html>
                <h1 text-align:center; style="font-size: 60px;margin: 20px;font-family: 'IBM Plex Sans', sans-serif;font-family: 'Satisfy', cursive;font-weight: 900;">SnapWire</h1>
                <body style="font-family: Arial, sans-serif; color: #333333; background-color: #f2f2f2; padding: 20px;">
                  <h1 style="color: #0066cc;">Hola ! ${name} 🖐️</h1>
                  <p style="font-size: 16px;">Este es tu codigo de verificacion :</p>
                  <div style="height:min-content; width:100%; background: white; color:black; text-align:center; font-size:30px"> <b>${code}</b></div>
                  <p style="font-size: 14px;">recuerda que no debes compartir este codigo con nadie.</p>
                  <p style="font-size: 12px; color: #999999;">SnapWire</p>
                </body>
              </html>`;
    await this.sendMail(email, "Codigo de verificacion", html);
  }

  async sendRecoveryLink(email: string, name: string, token: string) {
    const html = ` <html>
              <h1 text-align:center; style="font-size: 60px;margin: 20px;font-family: 'IBM Plex Sans', sans-serif;font-family: 'Satisfy', cursive;font-weight: 900;">SnapWire</h1>
              <body style="font-family: Arial, sans-serif; color: #333333; background-color: #f2f2f2; padding: 20px;">
                  <h1 style="color: #0066cc;">Hola ! ${name} 🖐️</h1>
                  <p style="font-size: 16px;">Recupera tu contraseña </p>
                  <a href="${process.env.SECURE_URL_RESET_PASSWORD}/${token}" ><div id="button_confirm" style="height:min-content; width:100%; background-color: #1399f3; color:white; text-align:center; font-size:20px"> <b>RESTABLECER CONTRASEÑA</b></div></a>
                  <p style="font-size: 14px;">...</p>
                  <p style="font-size: 12px; color: #999999;">SnapWire</p>
                  </body> 
              </html>`;
    await this.sendMail(email, "Restablecer contraseña", html);
  }
}
