/* eslint-disable @typescript-eslint/no-explicit-any */
import PostNotExist from "../../../Default/domain/exceptions/PostNotExist";
import { type Collection, type MongoClient, ObjectId } from "mongodb";
import Post from "../../domain/Post";
import PostCreate from "../../domain/PostCreate";
import PostRepository from "../../domain/PostRepository";

export default class MongoPostRepository implements PostRepository {
  private readonly postCollection: Collection;
  constructor(readonly client: MongoClient) {
    this.postCollection = client.db().collection("Post");
  }

  async create(post: PostCreate<string>): Promise<string> {
    const respDb = await this.postCollection.insertOne({
      media: post.media,
      author: new ObjectId(post.author),
      text: post.text,
      countLikes: 0,
      countComments: 0,
      visibility: true,
      deleted: false,
      archived: false,
      comments: false,
      createdAt: new Date(),
    });
    return respDb.insertedId.toString();
  }

  async find(postId: string): Promise<Post<string>> {
    const respDb = await this.postCollection.findOne(
      {
        _id: new ObjectId(postId),
        visibility: true,
        archived: false,
        deleted: false,
      },
      {
        projection: {
          _id: 1,
        },
      },
    );

    if (!respDb) {
      throw new PostNotExist(postId);
    }
    return new Post(
      respDb._id.toString(),
      "",
      "",
      "",
      false,
      true,
      "",
      0,
      0,
      [],
      new Date(),
      false,
    );
  }

  async delete(userId: string, postId: string): Promise<void> {
    const respDb = await this.postCollection.updateOne(
      {
        _id: new ObjectId(postId),
        author: new ObjectId(userId),
        deleted: false,
      },
      { $set: { deleted: true } },
    );
    if (respDb.matchedCount === 0) {
      throw new PostNotExist(postId);
    }
  }

  async get(
    userId: string,
    criteria: Map<string, unknown>,
  ): Promise<Array<Post<string>>> {
    const query: Record<string, unknown> = {};
    for (const pair of criteria) {
      if (pair[0] === "cursor") {
        query["createdAt"] = { $lt: new Date(Number(pair[1])) };
      }
      if (pair[0] === "author") {
        query["author"] = new ObjectId(String(pair[1]));
      }
    }

    const respDb = await this.postCollection
      .aggregate([
        {
          $match: {
            deleted: false,
            visibility: true,
            archived: false,
            ...query,
          },
        },
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: "User",
            localField: "author",
            foreignField: "_id",
            as: "author",
          },
        },

        {
          $lookup: {
            from: "Like",
            localField: "_id",
            foreignField: "to",
            as: "likes",
          },
        },
        {
          $set: {
            author: { $first: "$author" },
          },
        },
        {
          $project: {
            _id: 1,
            "likes.user": 1,
            "likes.deleted": 1,
            authorId: "$author._id",
            authorUrlAvatar: "$author.profile.avatar.url",
            authorUsername: "$author.account.username",
            authorCheckVerified: "$author.profile.checkVerified",
            comments: 1,
            countLikes: 1,
            text: 1,
            countComments: 1,
            media: 1,
            createdAt: 1,
          },
        },
      ])
      .limit(15)
      .toArray();

    return respDb.map((p): Post<string> => {
      return {
        id: p._id.toString(),
        authorId: p.authorId,
        authorUsername: p.authorUsername,
        authorUrlAvatar: p.authorUrlAvatar,
        authorCheckVerified: p.authorCheckVerified,
        countLikes: p.countLikes,
        countComments: p.countComments,
        createdAt: p.createdAt,
        media: p.media,
        comments: p.comments,
        text: p.text,
        liked: p.likes.some(
          (l: any) => l.user.toString() === userId && l.deleted === false,
        ),
      };
    });
  }

  /* async searchByIndex(query: string, userId: string): Promise<any> {
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
      likedbyme: { $in: [new Types.ObjectId(userId), "$likes"] },
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
                  path: "deleted",
                  value: false,
                },
              },
              {
                equals: {
                  path: "archived",
                  value: false,
                },
              },
              {
                equals: {
                  path: "visibility",
                  value: false,
                },
              },
            ],
            should: [
              {
                in: {
                  path: "likes",
                  value: userId,
                },
              },
            ],
          },
        },
      },
      {
        $limit: 15,
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
    return [];
  } */
}
