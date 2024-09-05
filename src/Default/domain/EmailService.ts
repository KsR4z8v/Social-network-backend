export default interface EmailService {
  sendEmail: (
    email: string,
    subject: string,
    bodyHtml: string,
  ) => Promise<void>;
}
