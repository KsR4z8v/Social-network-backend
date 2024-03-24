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
  //*ok
  async find(id_post: string): Promise<Record<string, any>> {
    const post = await this.postModel
      .findOne({
        _id: id_post,
        doc_deleted: false,
      })
      .select("_id author config");
    if (!post) {
      throw new PostNotExist(id_post);
    }
    return post;
  }
  //*ok
  async delete(id_post: string): Promise<void> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const post = await this.postModel
        .findOneAndUpdate(
          { _id: id_post, doc_deleted: false },
          { doc_deleted: true },
          { session }
        )
        .select("author");
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
  //*ok
  async getAll(
    { author }: Record<string, any>,
    id_user: string,
    cursor?: Date
  ): Promise<Record<string, any>[]> {
    const query_db: Record<string, any> = {
      "config.private": false,
      "config.archived": false,
      doc_deleted: false,
    };
    if (author) {
      query_db.author = author;
    }
    if (cursor) {
      query_db.createdAt = { $lt: cursor };
    }

    const projection = {
      countComments: { $size: "$comments" },
      countLikes: { $size: "$likes" },
      config: 1,
      text: 1,
      likedbyme: {
        $in: [new Types.ObjectId(id_user), "$likes.user"],
      },
      "media.url": 1,
      createdAt: 1,
    };

    const posts = await this.postModel
      .find(query_db, projection)
      .populate("author", "_id avatar.url username verified")
      .sort({ createdAt: "desc" })
      .limit(15);

    return posts;
  }

  //*ok es bellisimaaaaa
  async getBySearchIndex(query: string, id_user: string) {
    const projection = {
      countComments: { $size: "$comments" },
      countLikes: { $size: "$likes" },
      config: 1,
      text: 1,
      "media.url": 1,
      createdAt: 1,
      "author.avatar": 1,
      "author.username": 1,
      "author.verified": 1,
      "author._id": 1,
      likedbyme: { $in: [new Types.ObjectId(id_user), "$likes"] },
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
                  value: id_user,
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
  //*ok
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
      });
      const resp_db = await post.save({ session });
      const resp_db_2 = await this.userModel.updateOne(
        { _id: id_aut, doc_deleted: false },
        { $push: { posts: resp_db._id } },
        { session }
      );

      if (resp_db_2.modifiedCount === 0) {
        throw new UserNotExist(id_aut);
      }

      await session.commitTransaction();
      return resp_db._id.toString();
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }

  //*ok
  async like(id_user: string, id_post: string): Promise<void> {
    //*ok
    const post = await this.postModel
      .findOne({
        _id: id_post,
        doc_deleted: false,
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
            likes: [l],
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
  //*ok
  async comment(
    id_user: string,
    text: string,
    id_post: string
  ): Promise<Record<string, any>> {
    //*ok
    const post = await this.postModel.findOne(
      {
        _id: id_post,
        doc_deleted: false,
        "config.archived": false,
        "config.private": false,
      },
      {
        "config.comments_disabled": 1,
      }
    );

    if (!post) {
      throw new PostNotExist(id_post);
    }

    if ((post.config as Record<string, any>).comments_disabled) {
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
  //*ok
  async getComments(id_post: string, page: number = 1): Promise<any[]> {
    const post = await this.postModel
      .findOne(
        {
          _id: id_post,
          doc_deleted: false,
          "config.archived": false,
          "config.private": false,
        },
        {
          comments: {
            $slice: [-15 * page, 15],
          },
          "config.comments_disabled": 1,
        }
      )
      .populate("comments.user", "avatar.url username _id verified")
      .populate("comments.likes.user", "avatar.url username _id");

    if (!post) {
      throw new PostNotExist(id_post);
    }
    if ((post.config as Record<string, any>).comments_disabled) {
      throw new CommentsDeactivated(id_post);
    }
    return post.comments;
  }
  //*ok
  async getLikes(
    id_post: string,
    page: number = 1,
    id_user_v?: string
  ): Promise<Record<string, any>[]> {
    const post = await this.postModel
      .findOne(
        {
          _id: id_post,
          doc_deleted: false,
          "config.archived": false,
          "config.private": false,
        },
        {
          likes: {
            $slice: [-30 * page, 30],
          },
        }
      )
      .select("likes");

    if (!post) {
      throw new PostNotExist(id_post);
    }
    const query = {
      _id: {
        $in: post.likes.map((l) => l.user),
      },
    };
    //busco los usuarios que le dieron like a esa publicacion
    const users_like = await this.userModel.find(query, {
      _id: 1,
      username: 1,
      "avatar.url": 1,
      myfriend: {
        $in: [new Types.ObjectId(id_user_v), "$friends.user"],
      },
    });

    return users_like;
  }
  //TODO
  async update() {}
}
