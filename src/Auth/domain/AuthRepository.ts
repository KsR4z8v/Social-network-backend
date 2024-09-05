import type UserCredentials from "./UserCredentials";

export default interface AuthRepository {
  findUserCredentials: (
    user: string,
  ) => Promise<UserCredentials<string> | null>;
  updatePassword: (userId: string, password: string) => Promise<void>;
  setVerifyEmail: (userId: string) => Promise<void>;
  activateAccount: (userId: string) => Promise<void>;
}
