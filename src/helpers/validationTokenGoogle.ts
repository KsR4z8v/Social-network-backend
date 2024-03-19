import { OAuth2Client, LoginTicket, TokenPayload } from "google-auth-library";
import TokenGoogleInvalid from "../exceptions/TokenGoogleInvalid.exception";

const validateCredentialsGoogle = async (
  token: string
): Promise<TokenPayload> => {
  try {
    const client: OAuth2Client = new OAuth2Client(process.env.ID_CLIENT);
    const ticket: LoginTicket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.ID_CLIENT,
    });
    const data: TokenPayload | undefined = ticket.getPayload();
    if (!data) {
      throw new Error("Not tokenPayload");
    }
    return data;
  } catch (err) {
    throw new TokenGoogleInvalid();
  }
};

export default validateCredentialsGoogle;
