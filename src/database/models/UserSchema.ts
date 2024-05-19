import { Schema, Types } from "mongoose";
import type UserInterface from "./UserInterface";

export interface UserDocument extends UserInterface<Types.ObjectId>, Document {}

export default new Schema<UserDocument>(
  {
    bio: { type: String, default: null },
    username: { type: String, required: true },
    fullname: { type: String, required: true },
    password: { type: String, required: true },
    date_born: Date,
    email: { type: String, required: true },
    phone_number: { type: String, default: null },
    avatar: {
      id_kit: { type: String, default: null },
      url: { type: String, default: null },
      format: { type: String, default: null },
    },
    account_settings: {
      state_account: { type: Boolean, default: true },
      permission: { type: Types.ObjectId, default: null },
      verified_email: { type: Boolean, default: false },
    },
    user_preferences: {
      profileView: { type: Boolean, default: true },
      receive_requests: { type: Boolean, default: true },
    },
    verified: { type: Boolean, default: false },
    doc_deleted: { type: Boolean, default: false },
    countFriends: { type: Number, default: 0 },
    countPosts: { type: Number, default: 0 },
    friends: [{ user: { type: Types.ObjectId, ref: "User" } }],
    requests: [{ user: { type: Types.ObjectId, ref: "User" } }],
    my_requests_sent: [{ user: { type: Types.ObjectId, ref: "User" } }],
    posts: [{ type: Types.ObjectId, ref: "Post" }],
    posts_saved: [{ type: Types.ObjectId, ref: "Post" }],
    archived_posts: [{ type: Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true },
);
