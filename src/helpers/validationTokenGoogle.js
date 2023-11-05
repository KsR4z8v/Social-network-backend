

import { OAuth2Client } from "google-auth-library"


const validateCredentialsGoogle = async (token) => {
    const client = new OAuth2Client(process.env.ID_CLIENT)
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.ID_CLIENT
    })
    const data = ticket.getPayload()
    return data
}


export default validateCredentialsGoogle