/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Model, Types, type Connection } from "mongoose";
import UserNotExist from "../../exceptions/UserNotExist";
import PostNotExist from "../../exceptions/PostNotExist";
import CommentsDeactivated from "../../exceptions/CommentsDeactivated";
import type UserInterface from "../models/UserInterface";
import { type PostDocument } from "../models/PostSchema";
import { type UserDocument } from "../models/UserSchema";
import type PostInterface from "../models/PostInterface";

export default class MongoPostRepository {
  constructor(
    readonly connection: Connection,
    readonly postModel: Model<PostDocument>,
    readonly userModel: Model<UserDocument>,
  ) {}

  // *ok
  async find(idPost: string): Promise<Record<string, any>> {
    const post = await this.postModel
      .findOne({
        _id: idPost,
        doc_deleted: false,
      })
      .select("_id author config");
    if (!post) {
      throw new PostNotExist(idPost);
    }
    return post;
  }

  // *ok
  async delete(idPost: string): Promise<void> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const post = await this.postModel
        .findOneAndUpdate(
          { _id: idPost, doc_deleted: false },
          { doc_deleted: true },
          { session },
        )
        .select("author");
      if (!post) {
        throw new PostNotExist(idPost);
      }
      await this.userModel.updateOne(
        { _id: post.author },
        { $pullAll: { posts: [idPost] } },
        { session },
      );
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }

  // *ok
  async getAll(
    { author }: Record<string, any>,
    idUser: string,
    cursor?: Date,
  ): Promise<Array<PostInterface<Types.ObjectId>>> {
    const queryDb: Record<string, any> = {
      "config.private": false,
      "config.archived": false,
      doc_deleted: false,
    };
    if (author) {
      queryDb.author = author;
    }
    if (cursor) {
      queryDb.createdAt = { $lt: cursor };
    }

    const projection = {
      countComments: 1,
      countLikes: 1,
      config: 1,
      text: 1,
      likedbyme: {
        $in: [new Types.ObjectId(idUser), "$likes.user"],
      },
      "media.url": 1,
      createdAt: 1,
    };

    const posts = await this.postModel
      .find(queryDb, projection)
      .populate("author", "_id avatar.url username verified")
      .sort({ createdAt: "desc" })
      .limit(15);
    return posts;
  }

  // *ok es bellisimaaaaa
  async getBySearchIndex(
    query: string,
    idUser: string,
  ): Promise<Array<PostInterface<Types.ObjectId>>> {
    const projection = {
      countComments: { $size: "$comments" },
      countLikes: 1,
      config: 1,
      text: 1,
      "media.url": 1,
      createdAt: 1,
      "author.avatar": 1,
      "author.username": 1,
      "author.verified": 1,
      "author._id": 1,
      likedbyme: { $in: [new Types.ObjectId(idUser), "$likes"] },
    };
    const result = await this.postModel.aggregate([
      {
        $search: {
          index: "search_post",
          compound: {
            must: [
              {
                text: {
                  query,
                  path: {
                    wildcard: "*",
                  },
                },
              },
              {
                equals: {
                  path: "doc_deleted",
                  value: false,
                },
              },
              {
                equals: {
                  path: "config.archived",
                  value: false,
                },
              },
              {
                equals: {
                  path: "config.private",
                  value: false,
                },
              },
            ],
            should: [
              {
                in: {
                  path: "likes",
                  value: idUser,
                },
              },
            ],
          },
        },
      },
      {
        $limit: 20,
      },
      {
        $lookup: {
          from: "User",
          foreignField: "_id",
          localField: "author",
          as: "author",
        },
      },
      {
        $project: projection,
      },
    ]);
    return result;
  }

  // *ok
  async create(
    idAuthor: string,
    text: string | undefined,
    media: Array<Record<string, string>>,
  ): Promise<string> {
    const session = await this.connection.startSession();
    session.startTransaction();
    const mediaMap = media.map((m) => {
      return { url: m.url, id_kit: m.fileId };
    });

    try {
      const post = new this.postModel({
        author: idAuthor,
        text,
        media: mediaMap,
      });
      const resDb = await post.save({ session });
      const resDb2 = await this.userModel.updateOne(
        { _id: idAuthor, doc_deleted: false },
        { $push: { posts: resDb._id } },
        { session },
      );

      if (resDb2.modifiedCount === 0) {
        throw new UserNotExist(idAuthor);
      }

      await session.commitTransaction();
      return resDb._id.toString();
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }

  // *ok
  async like(idUser: string, idPost: string): Promise<void> {
    //  *ok
    const post = await this.postModel
      .findOne({
        _id: idPost,
        doc_deleted: false,
        "config.archived": false,
        "config.private": false,
      })
      .select("likes");
    if (!post) {
      throw new PostNotExist(idPost);
    }
    const l = post.likes.find((l: any) => l.user?.toString() === idUser);

    if (l) {
      await this.postModel.updateOne(
        { _id: idPost },
        {
          $inc: { countLikes: -1 },
          $pullAll: {
            likes: [l],
          },
        },
      );
    } else {
      await this.postModel.updateOne(
        { _id: idPost },
        {
          $inc: { countLikes: 1 },
          $push: { likes: { user: idUser, createdAt: new Date() } },
        },
      );
    }
  }

  // *ok
  async comment(idUser: string, text: string, idPost: string): Promise<string> {
    // *ok
    const post = await this.postModel.findOne(
      {
        _id: idPost,
        doc_deleted: false,
        "config.archived": false,
        "config.private": false,
      },
      {
        "config.comments_disabled": 1,
      },
    );

    if (!post) {
      throw new PostNotExist(idPost);
    }

    if ((post.config as Record<string, unknown>).comments_disabled) {
      throw new CommentsDeactivated(idPost);
    }
    const idComment = new Types.ObjectId();
    const comment: Record<string, unknown> = {
      user: idUser,
      edited: false,
      text,
      createdAt: new Date(),
    };
    await this.postModel.updateOne(
      { _id: idPost },
      {
        $inc: { countComments: 1 },
        $push: { comments: { _id: idComment, ...comment } },
      },
    );
    return idComment.toString();
  }

  // *ok
  async getComments(idPost: string, page = 1): Promise<any> {
    const post = await this.postModel
      .findOne(
        {
          _id: idPost,
          doc_deleted: false,
          "config.archived": false,
          "config.private": false,
        },
        {
          comments: {
            $slice: [-15 * page, 15],
          },
          "config.comments_disabled": 1,
        },
      )
      .populate("comments.user", "avatar.url username _id verified")
      .populate("comments.likes.user", "avatar.url username _id");

    if (!post) {
      throw new PostNotExist(idPost);
    }
    if ((post.config as Record<string, unknown>).comments_disabled) {
      throw new CommentsDeactivated(idPost);
    }
    return post.comments;
  }

  // *ok
  async getLikes(
    idPost: string,
    page: number = 1,
    idUserExt?: string,
  ): Promise<Array<UserInterface<Types.ObjectId>>> {
    const post = await this.postModel
      .findOne(
        {
          _id: idPost,
          doc_deleted: false,
          "config.archived": false,
          "config.private": false,
        },
        {
          likes: {
            $slice: [-30 * page, 30],
          },
        },
      )
      .select("likes");

    if (!post) {
      throw new PostNotExist(idPost);
    }
    const query = {
      _id: {
        $in: post.likes.map((l: any) => l.user),
      },
    };
    // busco los usuarios que le dieron like a esa publicacion
    const likes = await this.userModel.find(query, {
      _id: 1,
      username: 1,
      verified: 1,
      "avatar.url": 1,
      friends: {
        $elemMatch: { user: idUserExt },
      },
      my_requests_sent: {
        $elemMatch: { user: idUserExt },
      },
      requests: {
        $elemMatch: { user: idUserExt },
      },
    });

    return likes;
  }

  // TODO
  async update(): Promise<void> {
    throw new Error("Method don't implement");
  }
}
