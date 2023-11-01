import dotenv from 'dotenv'
dotenv.config()

export default {
    config_cors: {
        origin: ["https://nt4mmhp7-3000.use2.devtunnels.ms/", "*"],
        credentials: true,
    },
    IMAGE_KIT_CONFIG: {
        publicKey: process.env.PUBLIC_KEY_IMAGEKIT,
        privateKey: process.env.PRIVATE_KEY_IMAGEKIT,
        urlEndpoint: process.env.URL_ENDPOINT_IMAGEKIT,
        images_folder_dest: process.env.IMAGES_FOLDER_DEST,
        avatars_folder_dest: process.env.AVATARS_FOLDER_DEST,
    }
}
