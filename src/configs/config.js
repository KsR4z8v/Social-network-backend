import dotenv from 'dotenv'
dotenv.config()

export default {
    config_cors: {
        origin: ["https://nt4mmhp7-3000.use2.devtunnels.ms", 'http://localhost:3000'],
        credentials: true,
    },
    IMAGE_KIT_CONFIG: {
        publicKey: process.env.PUBLIC_KEY_IMAGEKIT,
        privateKey: process.env.PRIVATE_KEY_IMAGEKIT,
        urlEndpoint: process.env.URL_ENDPOINT_IMAGEKIT,
    },
    config_cookie: {
        httpOnly: true,
        secure: true,
        signed: false,
        sameSite: 'Strict',
        expires: new Date(Date.now() + 86400000),
    },
    config_token: {
        expiresIn: '6h'
    }
}
