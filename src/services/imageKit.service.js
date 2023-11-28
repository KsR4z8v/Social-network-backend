import ImageKit from 'imagekit'
import config from '../configs/config.js'
import FailureToLoadMedia from '../exceptions/FailureToLoadMedia.js';
import backOff from '../helpers/backOff.js';
const imagekit = new ImageKit(config.IMAGE_KIT_CONFIG);

export const upload_Media = async (files, path) => {
    let images_upload = [];
    const r = parseInt(Math.random() * files.length)//!simulo error

    for (let i = 0; i < files.length; i++) {
        try {
            const resp_ = await imagekit
                .upload({
                    file: files[i].data,
                    fileName: files[i].name,
                    folder: path + (files[i].mimetype === 'video/mp4' ? 'videos' : 'images')
                })
            images_upload.push({ url_media: resp_.url, id_kit: resp_.fileId });
        } catch (e) {
            //console.error(e.message);
            //elimino las imagenes

            if (images_upload.length > 0) {
                delete_Media(images_upload.map(i => i.id_kit))
            }
            throw new FailureToLoadMedia()
        }
    }
    console.log('IMAGENES INSERTADAS', images_upload.map(i => i.id_kit));
    return images_upload;
};

export const delete_Media = async (id_images) => {
    for (let i = 0; i < id_images.length; i++) {
        await backOff(async () => {
            console.log('Eliminando...', id_images[i]);
            await imagekit.deleteFile(id_images[i])
        }, { increment: 'sec' }, 10)
    }
}