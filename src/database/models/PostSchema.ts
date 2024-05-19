import { Schema, Types } from "mongoose";
import type PostInterface from "./PostInterface";

export interface PostDocument extends PostInterface<Types.ObjectId>, Document {}

const PostSchema = new Schema<PostDocument>(
  {
    author: { type: Types.ObjectId, ref: "User" },
    text: { type: String },
    config: {
      archived: { type: Boolean, default: false },
      private: { type: Boolean, default: false },
      comments_disabled: { type: Boolean, default: false },
    },
    doc_deleted: { type: Boolean, default: false },
    media: [
      {
        url: String,
        id_kit: String,
        format: { type: String, default: null },
      },
    ],
    countLikes: { type: Number, default: 0 },
    countComments: { type: Number, default: 0 },
    comments: [
      {
        user: { type: Types.ObjectId, ref: "User" },
        createdAt: { type: Date },
        edited: { type: Boolean, default: false },
        likes: [
          {
            user: { type: Types.ObjectId, ref: "User" },
            createdAt: { type: Date },
          },
        ],
        text: String,
      },
    ],
    likes: [
      {
        user: { type: Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export default PostSchema;
