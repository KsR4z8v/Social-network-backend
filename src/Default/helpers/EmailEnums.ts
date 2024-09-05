export function verificationCode(username: string, verifyCode: string): string {
  return `<html>
            <body style="font-family: Arial, sans-serif;  background-color: #f2f2f2; padding: 20px;">
            <p style="text-align:center; font-size:30px;" > Hola ${username}.</p>
            <p style="text-align:center; font-size: 15px;">Tu codigo de verificacion:</p>
            <div style="height:min-content; width:100%; background: white; color:black; text-align:center; font-size:30px"> <b>${verifyCode}</b></div>
            <p style="font-size: 11px;">Recuerda que no debes compartir este codigo con nadie.</p>
            <p style=" text-align:center; font-size: 10px; color: #999999;">Snapwire</p>
            </body>
         </html>`;
}

export function resetPassword(
  username: string,
  token: string,
  redirectToLink: string
): string {
  return `<html>
            <body style="font-family: Arial, sans-serif;  background-color: #f2f2f2; padding: 20px;">
            <p style="text-align:center; font-size:30px;" > Hola ${username}.</p>
            <p style="font-size: 16px;">Recupera tu contraseña </p>
            <a href="${redirectToLink}/${token}" ><div id="button_confirm" style="height:min-content; width:100%; background-color: #1399f3; color:white; text-align:center; font-size:20px"> <b>RESTABLECER CONTRASEÑA</b></div></a>
            <p style="font-size: 10px; color: #999999;">Snapwire</p>
            </body> 
          </html>`;
}
