import { ObjectId, type Collection, type MongoClient } from "mongodb";
import LikeRepository from "../../domain/LikeRepository";
import Like from "../../domain/Like";
import PostNotExist from "../../../Default/domain/exceptions/PostNotExist";

export default class MongoLikeRepository implements LikeRepository {
  private readonly likeCollection: Collection;
  private readonly postCollection: Collection;
  constructor(readonly client: MongoClient) {
    this.likeCollection = client.db().collection("Like");
    this.postCollection = client.db().collection("Post");
  }

  async obtain(criteria: Map<string, string>): Promise<Array<Like<string>>> {
    const query: Record<string, unknown> = {};
    for (const pair of criteria) {
      if (pair[0] === "to" || pair[0] === "user") {
        query[pair[0]] = new ObjectId(pair[1]);
      }
    }
    const respDb = await this.likeCollection
      .aggregate([
        { $match: { deleted: false, ...query } },
        {
          $lookup: {
            from: "User",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $project: {
            _id: 1,
            userId: { $first: "$user._id" },
            avatar: { $first: "$user.profile.avatar.url" },
            username: { $first: "$user.account.username" },
          },
        },
      ])
      .toArray();

    const likeFormat: Like<string>[] = respDb.map((l): Like<string> => {
      return {
        id: l._id.toString(),
        user: {
          id: l.userId.toString(),
          avatar: l.avatar,
          username: l.username,
          relationExternalId: null,
          requestSentExternalId: null,
          requestReceivedExternalId: null,
        },
        createdAt: new Date(),
      };
    });
    return likeFormat;
  }

  async like(userId: string, to: string, type: string): Promise<string> {
    const session = this.client.startSession();
    try {
      const likeFound = await this.likeCollection.findOne(
        {
          user: new ObjectId(userId),
          to: new ObjectId(to),
        },
        { projection: { _id: 1, deleted: 1 } },
      );

      session.startTransaction();
      let increment: number;
      let likeId: string;

      if (likeFound) {
        await this.likeCollection.updateOne(
          { _id: likeFound._id },
          { $set: { deleted: !likeFound.deleted } },
          { session },
        );
        if (likeFound.deleted) {
          increment = 1;
        } else {
          increment = -1;
        }
        likeId = likeFound._id.toString();
      } else {
        const respDb = await this.likeCollection.insertOne(
          {
            to: new ObjectId(to),
            user: new ObjectId(userId),
            deleted: false,
            createdAt: new Date(),
          },
          { session },
        );
        increment = 1;
        likeId = respDb.insertedId.toString();
      }

      if (type === "post") {
        const respDb = await this.postCollection.updateOne(
          { _id: new ObjectId(to) },
          {
            $inc: {
              countLikes: increment,
            },
          },
          { session },
        );
        if (respDb.matchedCount === 0) {
          throw new PostNotExist(to);
        }
      }

      await session.commitTransaction();
      return likeId;
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
