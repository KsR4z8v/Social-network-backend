import { type Auth, type gmail_v1, google } from "googleapis";

export default class ApiGoogleEmailService {
  private readonly oAuth2Client: Auth.OAuth2Client;
  private static instance: ApiGoogleEmailService;

  constructor(idClient: string, secretClient: string, token: string) {
    this.oAuth2Client = new google.auth.OAuth2(idClient, secretClient);
    this.oAuth2Client.setCredentials({ refresh_token: token });
    if (ApiGoogleEmailService.instance) {
      return ApiGoogleEmailService.instance;
    }

    ApiGoogleEmailService.instance = this;
    this.refreshToken();
    return this;
  }

  static getInstance(): ApiGoogleEmailService {
    return this.instance;
  }

  private refreshToken(): void {
    setTimeout(() => {
      this.oAuth2Client.getAccessToken((error, token) => {
        if (error) {
          console.log(error);
        } else {
          this.oAuth2Client.setCredentials({ access_token: token });
          console.log(token);
        }
      });
    }, 10000);
  }

  private async sendMail(
    email: string,
    subject: string,
    body: string,
  ): Promise<void> {
    const gmail: gmail_v1.Gmail = google.gmail({
      version: "v1",
      auth: this.oAuth2Client,
    });

    const encodedSubject = Buffer.from(subject).toString("base64");
    const emailContent: string = [
      "from: Snapwire",
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
          labelIds: ["Inbox"],
          raw: Buffer.from(emailContent).toString("base64"),
        },
      });
    } catch (e) {
      console.log("Error al enviar el correo", e);
    }
  }

  async sendVerificationCode(
    email: string,
    name: string,
    code: string,
  ): Promise<void> {
    const html = `<html>
                  <body style="font-family: Arial, sans-serif;  background-color: #f2f2f2; padding: 20px;">
                    <p style="text-align:center; font-size:30px;" > Hola ${name}.</p>
                    <p style="text-align:center; font-size: 15px;">Tu codigo de verificacion:</p>
                    <div style="height:min-content; width:100%; background: white; color:black; text-align:center; font-size:30px"> <b>${code}</b></div>
                    <p style="font-size: 11px;">Recuerda que no debes compartir este codigo con nadie.</p>
                    <p style=" text-align:center; font-size: 10px; color: #999999;">Snapwire</p>
                  </body>
                </html>`;
    await this.sendMail(email, "Codigo de verificacion", html);
  }

  async sendRecoveryLink(
    email: string,
    name: string,
    token: string,
  ): Promise<void> {
    const html = `<html>
                  <body style="font-family: Arial, sans-serif;  background-color: #f2f2f2; padding: 20px;">
                      <p style="text-align:center; font-size:30px;" > Hola ${name}.</p>
                      <p style="font-size: 16px;">Recupera tu contraseña </p>
                      <a href="${process.env.SECURE_URL_RESET_PASSWORD}/${token}" ><div id="button_confirm" style="height:min-content; width:100%; background-color: #1399f3; color:white; text-align:center; font-size:20px"> <b>RESTABLECER CONTRASEÑA</b></div></a>
                      <p style="font-size: 10px; color: #999999;">Snapwire</p>
                  </body> 
                </html>`;
    await this.sendMail(email, "Restablecer contraseña", html);
  }
}
