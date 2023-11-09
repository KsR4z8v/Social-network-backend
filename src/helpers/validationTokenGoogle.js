

import { OAuth2Client } from "google-auth-library"
import TokenGoogleInvalid from "../exceptions/TokenGoogleInvalid.exception.js"


const validateCredentialsGoogle = async (token) => {
    try {
        const client = new OAuth2Client(process.env.ID_CLIENT)
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.ID_CLIENT
        })
        const data = ticket.getPayload()
        return data
    } catch (err) {
        throw new TokenGoogleInvalid
    }
}


export default validateCredentialsGoogle