import PostCreate from "../domain/PostCreate";
import type PostRepository from "../domain/PostRepository";
import FileImage from "../../Default/domain/FileImage";
import Image from "../../Default/domain/Image";
import {
  UploadMediaRequest,
  uploadMediaV2,
} from "../../Default/infrastructure/services/StorageImageKit.Service";

export default class CreatePostCase {
  constructor(readonly postRepository: PostRepository) {}

  async run(
    userId: string,
    text: string | null,
    fileImages: FileImage[],
  ): Promise<string> {
    let imagesToUpload: Image[] = [];

    if (fileImages.length > 0) {
      const containerStorage = process.env.MEDIA_FOLDER_DEST ?? "";
      const uploadImages = await uploadMediaV2(
        fileImages.map((f): UploadMediaRequest => {
          return {
            buffer: f.buffer,
            name: f.originalName,
            size: f.size,
            type: f.format,
          };
        }),
        containerStorage,
      );

      imagesToUpload = uploadImages.map((i) => {
        return {
          externalId: i.fileId,
          url: i.url,
          thumbnailUrl: i.url,
        };
      });
    }

    const newPost = new PostCreate<string>(userId, text, imagesToUpload);
    const postId = await this.postRepository.create(newPost);
    return postId;
  }
}
