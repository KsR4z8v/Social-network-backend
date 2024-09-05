import type Friend from "./Friend";
import type User from "./User";
import type UserCreate from "./UserCreate";
import type UserExistingData from "./UserExistingData";
import type UserRequesting from "./UserRequesting";

export default interface UserRepository {
  create: (user: UserCreate) => Promise<string>;
  find: (user: string, externalUserId?: string) => Promise<User<string>>;
  exist: (user: UserExistingData) => Promise<UserExistingData | undefined>;
  update: (userId: string, userData: Map<string, unknown>) => Promise<void>;
  delete: (userId: string) => Promise<void>;
  sendRequest: (
    submittedUserId: string,
    recipientUserId: string
  ) => Promise<{ relationId: string } | { requestId: string }>;
  deleteRequest: (userId: string, requestId: string) => Promise<void>;
  deleteFriend: (userId: string, relationId: string) => Promise<void>;
  getFriends: (
    userId: string,
    externalUserId: string,
    page?: number
  ) => Promise<Array<Friend<string>>>;
  getRequests: (userId: string) => Promise<Array<UserRequesting<string>>>;
}
