/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ImageKit from "imagekit";
import FailureToLoadMedia from "../../domain/exceptions/FailureToLoadMedia";
import backOff from "../../helpers/backOff";
import { IMAGE_KIT_CONFIG } from "../../configs/config";

const imagekit = new ImageKit(IMAGE_KIT_CONFIG);

export interface UploadMediaRequest {
  buffer: Buffer;
  name: string;
  size: number;
  type: string;
}

export interface UploadMediaResponse {
  url: string;
  fileId: string;
}

export const uploadMedia = async (
  files: any[],
  path: string,
): Promise<UploadMediaResponse[]> => {
  const imagesUpload: UploadMediaResponse[] = [];

  for (const file of files) {
    try {
      const resp_ = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
        folder: path + (file.mimetype === "video/mp4" ? "videos" : "images"),
      });
      imagesUpload.push({ url: resp_.url, fileId: resp_.fileId });
    } catch (e) {
      if (imagesUpload.length > 0) {
        void deleteMedia(imagesUpload.map((i) => i.fileId));
      }
      throw new FailureToLoadMedia();
    }
  }
  return imagesUpload;
};

export const uploadMediaV2 = async (
  files: UploadMediaRequest[],
  path: string,
): Promise<UploadMediaResponse[]> => {
  try {
    const promises: Promise<any>[] = [];
    for (const file of files) {
      promises.push(
        imagekit.upload({
          file: file.buffer,
          fileName: file.name,
          folder: path + (file.type === "video/mp4" ? "videos" : "images"),
        }),
      );
    }
    const responses = await Promise.all(promises);

    const responseFormat: UploadMediaResponse[] = responses.map(
      (r): UploadMediaResponse => {
        return { url: r.url, fileId: r.fileId };
      },
    );

    return responseFormat;
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
