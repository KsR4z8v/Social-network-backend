import type AccountSettings from "./AccountSettings";
import type UserPreferences from "./UserPreferences";

export interface Avatar {
  url: string;
  format?: string;
  id_kit?: string;
}

export default interface UserInterface<I> {
  _id: I;
  username: string;
  email: string;
  password: string;
  bio: string;
  avatar: Avatar;
  verified: boolean;
  fullname: string;
  date_born: Date;
  phone_number: string;
  countPosts: number;
  countFriends: number;
  doc_deleted: boolean;
  user_preferences: UserPreferences;
  account_settings: AccountSettings;
  friends: Array<{
    _id: I;
    user: I;
  }>;
  requests: Array<{
    _id: I;
    user: I;
  }>;
  my_requests_sent: Array<{
    _id: I;
    user: I;
  }>;
  posts: I[];
  posts_saved: I[];
  archived_posts: I[];
  myFriend?: { id_relation: string } | null;
  requestSent?: { id_request: string } | null;
  requestReceived?: { id_request: string } | null;
  createdAt: Date;
}
