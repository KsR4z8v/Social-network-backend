import type FileImage from "../../Default/domain/FileImage";
import type UserRepository from "../domain/UserRepository";
import { uploadMediaV2 } from "../../Default/infrastructure/services/StorageImageKit.Service";
import type Image from "../../Default/domain/Image";

export default class UpdateUserCase {
  constructor(readonly userRepository: UserRepository) {}
  async run(
    userId: string,
    userData: Map<string, unknown>,
    avatarFile: FileImage | undefined,
  ): Promise<void> {
    if (avatarFile && !userData.has("avatar")) {
      const containerName: string | undefined = process.env.AVATARS_FOLDER_DEST;
      if (!containerName) {
        throw new Error("No encuentra la variable de entorno");
      }
      const response = await uploadMediaV2(
        [
          {
            buffer: avatarFile.buffer,
            name: avatarFile.originalName,
            size: avatarFile.size,
            type: avatarFile.format,
          },
        ],
        containerName,
      );
      const newAvatar: Image = {
        url: response[0].url,
        externalId: response[0].fileId,
      };
      userData.set("avatar", newAvatar);
    }
    if (userData.get("avatar") === "delete") {
      const defaultAvatar: Image = {
        url: process.env.AVATAR_DEFAULT ?? "",
        externalId: null,
      };
      userData.set("avatar", defaultAvatar);
    }

    if (userData.size > 0) {
      await this.userRepository.update(userId, userData);
    }
  }
}
