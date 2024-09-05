import { hashString } from "../../Default/helpers/hashString";
import type Avatar from "../../Default/domain/Image";

export default class UserCreate {
  public hashedPassword: string;
  constructor(
    readonly username: string,
    readonly email: string,
    readonly avatar: Avatar,
    readonly fullname: string,
    readonly password: string,
    readonly dateBorn: Date,
    readonly userAgent: string | null,
    readonly ip: string | null,
  ) {
    this.hashedPassword = "";
  }

  async hashPassword(): Promise<void> {
    this.hashedPassword = await hashString(this.password);
  }
}
