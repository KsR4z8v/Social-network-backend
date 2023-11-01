import { ImageKit } from 'imagekit'
import config from '../configs/config.js'
const imagekit = new ImageKit(config.IMAGE_KIT_CONFIG);

export const upload_Images = async (files, path) => {
    let images_upload = [];
    for (let i = 0; i < files.length; i++) {
        await imagekit
            .upload({
                file: files[i].data,
                fileName: files[i].name,
                folder: path
            })
            .then((r) => {
                images_upload.push({ url: r.url, id_cdn: r.fileId });
            })
            .catch((er) => {
                console.log("Error:", er);
            });
    }
    return images_upload;
};

