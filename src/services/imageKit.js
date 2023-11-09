import ImageKit from 'imagekit'
import config from '../configs/config.js'
const imagekit = new ImageKit(config.IMAGE_KIT_CONFIG);

export const upload_Media = async (files, path) => {
    let images_upload = [];
    for (let i = 0; i < files.length; i++) {
        await imagekit
            .upload({
                file: files[i].data,
                fileName: files[i].name,
                folder: path + (files[i].mimetype === 'video/mp4' ? 'videos' : 'images')
            })
            .then((r) => {
                images_upload.push({ url_media: r.url, id_kit: r.fileId });
            })
            .catch((er) => {
                console.log("Error:", er);
            });
    }
    return images_upload;
};

export const delete_Media = async (id_images) => {
    for (let i = 0; i < id_images.length; i++) {
        await imagekit
            .deleteFile(id_images[i])
            .then((r) => {
                console.log(r);
            })
            .catch((er) => {
                console.log("Error:", er);
            });
    }
}