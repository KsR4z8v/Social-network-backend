import { Resend } from "resend";


const resend = new Resend("re_NY2g3wF8_L9PrgnniqQq6LDccunpK8caY");

const sendEmail = async (code, email) => {
  const data = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [email],
    subject: `SNAPWIRE`,
    html: `<p>Tu código de verificación es <strong>${code}</strong> </p>`,
  });

  console.log(data);
}


export default sendEmail;