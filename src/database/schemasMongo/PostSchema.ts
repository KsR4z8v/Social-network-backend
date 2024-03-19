import { Schema, Types } from "mongoose";

const PostSchema = new Schema(
  {
    author: { type: Types.ObjectId, ref: "User" },
    text: { type: String },
    config: {
      archived: Boolean,
      deleted: Boolean,
      private: Boolean,
      deactive_comments: Boolean,
    },

    media: [
      {
        url: String,
        id_kit: String,
      },
    ],
    comments: [
      {
        user: { type: Types.ObjectId, ref: "User" },
        createdAt: { type: Date },
        edited: Boolean,
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
        createdAt: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

export default PostSchema;
