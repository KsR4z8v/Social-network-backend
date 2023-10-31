import { Resend } from "resend";


const resend = new Resend("re_NY2g3wF8_L9PrgnniqQq6LDccunpK8caY");

const sendEmail = async (code, email) => {
  try {
    const data = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: `SNAPWIRE`,
      html: `<p>Tu código de verificación es <strong>${code}</strong> </p>`,
    });
  } catch (error) {
    return json({ text : "Error al enviar el correo de verificación" });
  }
}


export default sendEmail;