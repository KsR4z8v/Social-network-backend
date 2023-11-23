import jwt from 'jsonwebtoken'
import responseTemplates from '../handlersResponses/responseTemplates.js';
const { internalError } = responseTemplates
const verify_token = (req, resp, next) => {

    try {
        const { tkn } = req.cookies
        const { auth } = req.headers
        console.log(auth, tkn);
        if (!tkn && !auth) {
            return resp.status(401).json({ message: 'token not found' })
        }

        const bearer_token = auth?.split('Bearer token:')[1]
        jwt.verify(tkn || bearer_token, process.env.KEY_SECRET_JWT)
        const data_tkn = jwt.decode(tkn || bearer_token)
        req.id_user = data_tkn.id_user
        req.authorization = data_tkn?.authorization
        next()
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) return resp.status(403).json({ message: 'Token has expired' })
        if (e instanceof jwt.JsonWebTokenError) return resp.status(403).json({ message: 'Token is invalid' })
        return resp.status(500).json(internalError())
    }
}



export default verify_token