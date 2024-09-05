import type EmailService from "../../domain/EmailService";
import NodeEmailService from "./NodeEmail.Service";

export const emailService: EmailService = new NodeEmailService();
