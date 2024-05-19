/* eslint-disable @typescript-eslint/no-explicit-any */
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

export const uploadMediaV2 = async (
  files: any[],
  path: string,
): Promise<any> => {
  try {
    const promises = [];
    for (const file of files) {
      promises.push(
        imagekit.upload({
          file: file.buffer,
          fileName: file.originalname,
          folder: path + (file.mimetype === "video/mp4" ? "videos" : "images"),
        }),
      );
    }
    return await Promise.all(promises);
  } catch (error) {
    throw new FailureToLoadMedia();
  }
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
