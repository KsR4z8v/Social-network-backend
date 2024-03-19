import { Connection, Types } from "mongoose";
import PostSchema from "../schemasMongo/PostSchema";
import UserSchema from "../schemasMongo/UserSchema";
import UserNotExist from "../../exceptions/UserNotExist";
import PostNotExist from "../../exceptions/PostNotExist";
import CommentsDeactivated from "../../exceptions/CommentsDeactivated";
export default class MongoPostRepository {
  private connection: Connection;
  private postModel;
  private userModel;
  constructor(connection: Connection) {
    this.connection = connection;
    this.postModel = connection.model("Post", PostSchema, "Post");
    this.userModel = connection.model("User", UserSchema, "User");
  }
  async find(id_post: string): Promise<Record<string, any>> {
    const post = await this.postModel
      .findOne({
        _id: id_post,
        "config.deleted": false,
      })
      .select("_id author config");
    if (!post) {
      throw new PostNotExist(id_post);
    }
    return post;
  }

  async delete(id_post: string): Promise<void> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const post = await this.postModel
        .findOneAndUpdate(
          { _id: id_post, "config.deleted": false },
          { "config.deleted": true },
          { session }
        )
        .select("_id author");

      if (!post) {
        throw new PostNotExist(id_post);
      }
      await this.userModel.updateOne(
        { _id: post.author },
        { $pullAll: { posts: [id_post] } },
        { session }
      );
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }
  async getAll(
    filters: Record<string, any>,
    cursor?: string
  ): Promise<Record<string, any>[]> {
    const posts = await this.postModel
      .find(
        {
          "config.private": false,
          "config.archived": false,
          "config.deleted": false,
        },
        {
          countComments: { $size: "$comments" },
          countLikes: { $size: "$likes" },
          config: 1,
          text: 1,
          likes: 1,
          "media.url": 1,
          createdAt: 1,
        }
      )
      .populate("author", "_id avatar.url username")
      .sort({ createdAt: "desc" });

    return posts;
  }
  async create(
    id_aut: string,
    text: string | undefined,
    media: Record<string, string>[]
  ): Promise<string> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const post = new this.postModel({
        author: id_aut,
        text,
        media,
        config: {
          private: false,
          deleted: false,
          archived: false,
          deactive_comments: false,
        },
      });
      const resp_db = await post.save({ session });
      const user_ = await this.userModel.findOne({ _id: id_aut });
      if (!user_) {
        throw new UserNotExist(id_aut);
      }
      user_.posts.unshift(resp_db._id);
      await user_.save({ session });

      await session.commitTransaction();
      return resp_db._id.toString();
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }
  async like(id_user: string, id_post: string): Promise<void> {
    const post = await this.postModel
      .findOne({
        _id: id_post,
        "config.deleted": false,
        "config.archived": false,
        "config.private": false,
      })
      .select("likes");
    if (!post) {
      throw new PostNotExist(id_post);
    }
    const l = post.likes.find((l) => l.user?.toString() === id_user);
    if (l) {
      await this.postModel.updateOne(
        { _id: id_post },
        {
          $pullAll: {
            likes: [{ user: l.user, _id: l._id, createdAt: l.createdAt }],
          },
        }
      );
    } else {
      await this.postModel.updateOne(
        { _id: id_post },
        { $push: { likes: { user: id_user, createdAt: new Date() } } }
      );
    }
  }
  async comment(
    id_user: string,
    text: string,
    id_post: string
  ): Promise<Record<string, any>> {
    const post = await this.postModel
      .findOne({
        _id: id_post,
        "config.deleted": false,
        "config.archived": false,
        "config.private": false,
      })
      .select("config.deactive_comments");

    if (!post) {
      throw new PostNotExist(id_post);
    }
    if (post.config?.deactive_comments) {
      throw new CommentsDeactivated(id_post);
    }
    const comment: Record<string, any> = {
      _id: new Types.ObjectId(),
      user: id_user,
      edited: false,
      text,
      createdAt: new Date(),
    };
    await this.postModel.updateOne(
      { _id: id_post },
      { $push: { comments: comment } }
    );
    return comment;
  }
  async getComments(
    id_post: string,
    cursor: number = 1
  ): Promise<Record<string, any>[]> {
    const post = await this.postModel
      .findOne(
        {
          _id: id_post,
          "config.deleted": false,
          "config.archived": false,
          "config.private": false,
        },
        {
          comments: {
            $slice: [-15 * cursor, 15],
          },
          "config.deactive_comments": 1,
        }
      )
      .populate("comments.user", "avatar.url username _id")
      .populate("comments.likes.user", "avatar.url username _id");

    if (!post) {
      throw new PostNotExist(id_post);
    }
    if (post.config?.deactive_comments) {
      throw new CommentsDeactivated(id_post);
    }
    return post.comments;
  }
  async getLikes(
    id_post: string,
    cursor: number = 1
  ): Promise<Record<string, any>[]> {
    const post = await this.postModel
      .findOne(
        {
          _id: id_post,
          "config.deleted": false,
          "config.archived": false,
          "config.private": false,
        },
        {
          likes: {
            $slice: [-30 * cursor, 30],
          },
        }
      )
      .populate("likes.user", "avatar.url username _id");

    if (!post) {
      throw new PostNotExist(id_post);
    }
    return post.likes;
  }
  async update() {}
}
