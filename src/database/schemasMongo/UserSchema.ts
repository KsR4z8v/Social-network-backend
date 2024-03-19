import { Schema, Types } from "mongoose";

export default new Schema(
  {
    bio: String,
    username: { type: String },
    fullname: String,
    password: String,
    date_born: Date,
    email: String,
    phone_number: String,
    avatar: {
      id_kit: String,
      url: String,
      format: String,
    },
    account_settings: {
      state_account: Boolean,
      permission: Types.ObjectId,
      verified_email: Boolean,
    },
    user_preferences: {
      profileView: Boolean,
      receive_requests: Boolean,
    },
    verified: Boolean,
    doc_deleted: Boolean,
    friends: [{ user: { type: Types.ObjectId, ref: "User" } }],
    requests: [{ user: { type: Types.ObjectId, ref: "User" } }],
    my_requests_sent: [{ user: { type: Types.ObjectId, ref: "User" } }],
    posts: [{ type: Types.ObjectId, ref: "Post" }],
    posts_saved: [{ type: Types.ObjectId, ref: "Post" }],
    archived_posts: [{ type: Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);
