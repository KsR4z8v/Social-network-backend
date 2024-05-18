import type AccountSettings from "./AccountSettings";
import type UserPreferences from "./UserPreferences";
import bcrypt from "bcryptjs";

export interface Avatar {
  url: string;
  format?: string;
  id_kit?: string;
}

export default class User {
  constructor(
    readonly id: string,
    readonly username: string,
    readonly email: string,
    readonly password: string,
    readonly bio: string,
    readonly avatar: Avatar,
    readonly verified: boolean,
    readonly fullname: string,
    readonly dateBorn: Date,
    readonly phoneNumber: string,
    readonly countPosts: number,
    readonly countFriends: number,
    readonly userPreferences: UserPreferences,
    readonly accountSettings: AccountSettings,
    readonly myFriend: { id_relation: string } | null,
    readonly requestSent?: { id_request: string } | null,
    readonly requestReceived?: { id_request: string } | null,
  ) {}

  async validatePassword(pass: string): Promise<boolean> {
    const passValidation: boolean = await bcrypt.compare(pass, this.password);
    return passValidation;
  }
}
