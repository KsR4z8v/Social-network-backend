import ImageKit from "imagekit";
import config from "../configs/config";
import FailureToLoadMedia from "../exceptions/FailureToLoadMedia";
import backOff from "../helpers/backOff";
const imagekit = new ImageKit(config.IMAGE_KIT_CONFIG);

export const upload_Media = async (
  files: Express.Multer.File[],
  path: string
) => {
  let images_upload: Record<string, string>[] = [];

  for (let i = 0; i < files.length; i++) {
    try {
      const resp_ = await imagekit.upload({
        file: files[i].buffer,
        fileName: files[i].originalname,
        folder:
          path + (files[i].mimetype === "video/mp4" ? "videos" : "images"),
      });
      images_upload.push({ url: resp_.url, id_kit: resp_.fileId });
    } catch (e) {
      if (images_upload.length > 0) {
        delete_Media(images_upload.map((i) => i.id_kit));
      }
      throw new FailureToLoadMedia();
    }
  }
  return images_upload;
};

export const delete_Media = async (id_images: string[]) => {
  for (let i = 0; i < id_images.length; i++) {
    await backOff(
      async () => {
        console.log("Eliminando...", id_images[i]);
        await imagekit.deleteFile(id_images[i]);
      },
      "sec",
      10
    );
  }
};
