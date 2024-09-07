import {
  OAuth2Client,
  type LoginTicket,
  type TokenPayload,
} from "google-auth-library";
import TokenGoogleInvalid from "../domain/exceptions/TokenGoogleInvalid.exception";

const validateCredentialsGoogle = async (
  token: string,
  clientId: string,
): Promise<TokenPayload> => {
  try {
    const client: OAuth2Client = new OAuth2Client(clientId);
    const ticket: LoginTicket = await client.verifyIdToken({
      idToken: token,
      audience: clientId,
    });
    const data: TokenPayload | undefined = ticket.getPayload();

    if (!data) {
      throw new Error();
    }
    return data;
  } catch (err) {
    throw new TokenGoogleInvalid();
  }
};

export default validateCredentialsGoogle;
