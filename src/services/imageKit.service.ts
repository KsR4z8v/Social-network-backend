import ImageKit from "imagekit";
import FailureToLoadMedia from "../exceptions/FailureToLoadMedia";
import backOff from "../helpers/backOff";
import config from "../configs/config";

const imagekit = new ImageKit(config.IMAGE_KIT_CONFIG);

export type UploadMediaResponse = Array<{
  url: string;
  id_kit: string;
}>;

export const uploadMedia = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  files: any[],
  path: string,
): Promise<UploadMediaResponse> => {
  const imagesUpload: UploadMediaResponse = [];

  for (const file of files) {
    try {
      const resp_ = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
        folder: path + (file.mimetype === "video/mp4" ? "videos" : "images"),
      });
      imagesUpload.push({ url: resp_.url, id_kit: resp_.fileId });
    } catch (e) {
      if (imagesUpload.length > 0) {
        void deleteMedia(imagesUpload.map((i) => i.id_kit));
      }
      throw new FailureToLoadMedia();
    }
  }
  return imagesUpload;
};

export const deleteMedia = async (idImages: string[]): Promise<void> => {
  for (const idImage of idImages) {
    await backOff(
      async () => {
        // console.log("Eliminando...", id_image);
        await imagekit.deleteFile(idImage);
      },
      "sec",
      10,
    );
  }
};
