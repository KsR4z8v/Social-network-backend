import EmailService from "../../domain/EmailService";
import { createTransport, Transporter } from "nodemailer";

export default class NodeEmailService implements EmailService {
  private readonly CONFIGS = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASSWORD_EMAIL,
    },
  };
  private transporter: Transporter;

  constructor() {
    this.transporter = createTransport(this.CONFIGS);
  }

  async sendEmail(
    email: string,
    subject: string,
    bodyHtml: string,
  ): Promise<void> {
    try {
      const response = await this.transporter.sendMail({
        from: "snapwireinfo@gmail.com",
        to: email,
        subject,
        html: bodyHtml,
      });
      // console.log("Envia correo a", email);
    } catch (error) {
      console.log(error);
    }
  }
}
