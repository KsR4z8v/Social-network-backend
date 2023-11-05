import jwt from 'jsonwebtoken'
const verify_token = (req, resp, next) => {

    try {
        const { tkn } = req.cookies
        const { auth } = req.headers
        if (!tkn && !auth) {
            return resp.status(401).json({ message: 'token not found' })
        }

        const bearer_token = auth?.split('Bearer token:')[1]

        jwt.verify(tkn || bearer_token, process.env.KEY_SECRET_JWT)
        const data_tkn = jwt.decode(tkn)
        req.id_user = data_tkn.id_user

        next()
    } catch (error) {
        console.log(error);
        return resp.status(403).json({ message: 'Token is invalid' })

    }
}



export default verify_token