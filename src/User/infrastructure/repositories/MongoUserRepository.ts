/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-explicit-any */
import UserNotExist from "../../../Default/domain/exceptions/UserNotExist";
import RequestNotExist from "../../../Default/domain/exceptions/RequestNotExist";
import { type Collection, ObjectId, type MongoClient } from "mongodb";
import User from "../../domain/User";
import type UserCreate from "../../domain/UserCreate";
import type UserRepository from "../../domain/UserRepository";
import type UserExistingData from "../../domain/UserExistingData";
import Friend from "../../domain/Friend";
import UserRequesting from "../../domain/UserRequesting";

export default class MongoUserRepository implements UserRepository {
  private readonly userCollection: Collection;
  constructor(readonly client: MongoClient) {
    this.userCollection = client.db().collection("User");
  }

  async create(user: UserCreate): Promise<string> {
    const currentDate: Date = new Date();
    const respDb = await this.userCollection.insertOne({
      tracking: {
        lastConnection: currentDate,
        ip: [user.ip],
        userAgent: user.userAgent,
      },
      profile: {
        bio: "",
        avatar: user.avatar,
        countPosts: 0,
        countFriends: 0,
        checkVerified: false,
        profileView: true,
        receiveRequests: true,
      },
      account: {
        username: user.username,
        password: user.hashedPassword,
        fullname: user.fullname,
        dateBorn: user.dateBorn,
        email: user.email,
        phoneNumber: "",
        state: true,
        emailVerified: false,
        deleted: false,
      },
      savedPosts: [],
      friends: [],
      requestsSent: [],
      requestsReceived: [],
      createdAt: currentDate,
      updateAt: currentDate,
      deletedAt: null,
    });
    return respDb.insertedId.toString();
  }

  async find(user: string, externalUserId: string = ""): Promise<User<string>> {
    const externalUserIdObject: ObjectId | null = ObjectId.isValid(
      externalUserId,
    )
      ? new ObjectId(externalUserId)
      : null;

    const respDb = await this.userCollection.findOne(
      {
        $and: [
          {
            $or: [
              { _id: ObjectId.isValid(user) ? new ObjectId(user) : undefined },
              { "account.username": user },
            ],
          },
          {
            "account.deleted": false,
            deletedAt: null,
          },
        ],
      },
      {
        projection: {
          _id: 1,
          "account.phoneNumber": 1,
          "account.email": 1,
          "account.dateBorn": 1,
          "account.emailVerified": 1,
          "account.state": 1,
          "account.username": 1,
          "account.fullname": 1,
          "profile.avatar.url": 1,
          "profile.bio": 1,
          "profile.checkVerified": 1,
          "profile.countPosts": 1,
          "profile.countFriends": 1,
          "profile.profileView": 1,
          "profile.receiveRequests": 1,
          friends: { $elemMatch: { user: externalUserIdObject } },
          requestsReceived: {
            $elemMatch: { user: externalUserIdObject },
          },
          requestsSent: {
            $elemMatch: { user: externalUserIdObject },
          },
          createdAt: 1,
          updateAt: 1,
        },
        showRecordId: true,
      },
    );

    if (!respDb) throw new UserNotExist(user);
    return new User<string>(
      respDb._id.toString(),
      respDb.account.username as string,
      respDb.account.email as string,
      respDb.profile.bio as string,
      { url: respDb.profile.avatar.url, externalId: null },
      respDb.profile.checkVerified as boolean,
      respDb.account.emailVerified as boolean,
      respDb.account.state as boolean,
      respDb.account.fullname as string,
      respDb.account.dateBorn as Date,
      respDb.account.phoneNumber as string,
      respDb.profile.countPosts as number,
      respDb.profile.countFriends as number,
      respDb.profile.profileView as boolean,
      respDb.profile.receiveRequests as boolean,
      respDb.createdAt as Date,
      respDb.updateAt as Date,
      respDb.friends
        ? { relationId: respDb.friends[0].relationId.toString() }
        : null,
      respDb.requestsReceived
        ? { requestId: respDb.requestsReceived[0].requestId.toString() }
        : null,
      respDb.requestsSent
        ? { requestId: respDb.requestsSent[0].requestId.toString() }
        : null,
    );
  }

  async update(userId: string, data: Map<string, unknown>): Promise<void> {
    const accountFields: string[] = [
      "username",
      "password",
      "fullname",
      "dateBorn",
      "email",
      "phoneNumber",
      "state",
      "emailVerified",
      "deleted",
    ];
    const profileFields: string[] = [
      "bio",
      "avatar",
      "countPosts",
      "countFriends",
      "checkVerified",
      "profileView",
      "receiveRequests",
    ];
    for (const pair of data) {
      if (accountFields.includes(pair[0])) {
        data.set(`account.${pair[0]}`, pair[1]);
        data.delete(pair[0]);
      }
      if (profileFields.includes(pair[0])) {
        data.set(`profile.${pair[0]}`, pair[1]);
        data.delete(pair[0]);
      }
    }
    const resDb = await this.userCollection.updateOne(
      { _id: new ObjectId(userId), "account.deleted": false, deletedAt: null },
      { $set: data },
    );

    if (resDb.matchedCount === 0) {
      throw new UserNotExist(userId);
    }
  }

  async delete(userId: string): Promise<void> {
    const session = this.client.startSession();
    session.startTransaction();
    try {
      const currentDateMilliseconds = new Date().getTime();
      const respDb = await this.userCollection.updateOne(
        { _id: new ObjectId(userId), "account.deleted": false },
        {
          $set: {
            deletedAt: new Date(currentDateMilliseconds + 2592000000),
            "account.state": false,
          },
        },
        { session },
      );
      if (respDb.matchedCount === 0) {
        throw new UserNotExist(userId);
      }
      await this.client
        .db()
        .collection("Posts")
        .updateMany(
          { author: new ObjectId(userId) },
          { $set: { deleted: true } },
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

  async sendRequest(
    submitterUserId: string,
    recipientUserId: string,
  ): Promise<{ relationId: string } | { requestId: string }> {
    const session = this.client.startSession();

    try {
      const submitterUser = await this.userCollection.findOne(
        {
          _id: new ObjectId(submitterUserId),
          "account.deleted": false,
          deletedAt: null,
        },
        {
          projection: {
            friends: { $elemMatch: { user: new ObjectId(recipientUserId) } },
            requestsReceived: {
              $elemMatch: { user: new ObjectId(recipientUserId) },
            },
            requestsSent: {
              $elemMatch: { user: new ObjectId(recipientUserId) },
            },
          },
        },
      );

      const recipientUser = await this.userCollection.findOne(
        {
          _id: new ObjectId(recipientUserId),
          "account.deleted": false,
          deletedAt: null,
        },
        { projection: { "profile.receiveRequests": 1 } },
      );

      if (!submitterUser || !recipientUser) {
        throw new UserNotExist(
          !submitterUser ? submitterUserId : recipientUserId,
        );
      }

      if (submitterUser.friends) {
        // si ya son amigos
        return {
          relationId: submitterUser.friends[0].relationId.toString(),
        };
      }

      if (submitterUser.requestsSent) {
        return {
          requestId: submitterUser.requestsSent[0].requestId.toString(),
        };
      }
      const requestFound = submitterUser.requestsReceived;

      if (requestFound) {
        // si ya existe una solicitud por parte del destinatario , se acepta y se forma una relacion de amistad
        session.startTransaction();

        await this.userCollection.updateOne(
          { _id: new ObjectId(recipientUserId) },
          {
            $pullAll: {
              requestsSent: [
                {
                  requestId: requestFound[0].requestId,
                  user: new ObjectId(submitterUserId),
                },
              ],
            } as any,
          },
          { session },
        );

        await this.userCollection.updateOne(
          { _id: new ObjectId(submitterUserId) },
          { $pullAll: { requestsReceived: [requestFound[0]] } as any },
          { session },
        );

        await this.userCollection.updateOne(
          { _id: new ObjectId(submitterUserId) },
          {
            $inc: { "profile.countFriends": 1 },
            $push: {
              friends: {
                relationId: requestFound[0].requestId,
                user: new ObjectId(recipientUserId),
              },
            } as any,
          },
          { session },
        );

        await this.userCollection.updateOne(
          { _id: new ObjectId(recipientUserId) },
          {
            $inc: { "profile.countFriends": 1 },
            $push: {
              friends: {
                relationId: requestFound[0].requestId,
                user: new ObjectId(submitterUserId),
              },
            } as any,
          },
          { session },
        );

        await session.commitTransaction();

        return {
          relationId: requestFound[0].requestId.toString(),
        };
      } else {
        if (!recipientUser.profile.receiveRequests) {
          throw new Error("El usuario no permite recibir solicitudes");
        }

        session.startTransaction();

        const requestId: ObjectId = new ObjectId();

        await this.userCollection.updateOne(
          { _id: new ObjectId(submitterUserId) },
          {
            $push: {
              requestsSent: { requestId, user: new ObjectId(recipientUserId) },
            } as any,
          },
          { session },
        );

        await this.userCollection.updateOne(
          { _id: new ObjectId(recipientUserId) },
          {
            $push: {
              requestsReceived: {
                requestId,
                user: new ObjectId(submitterUserId),
              },
            } as any,
          },
          { session },
        );

        await session.commitTransaction();

        return { requestId: requestId.toString() };
      }
    } catch (e) {
      if (session.inTransaction()) await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }

  async deleteRequest(userId: string, requestId: string): Promise<void> {
    const session = this.client.startSession();

    try {
      const user1 = await this.userCollection.findOne(
        {
          _id: new ObjectId(userId),
          "account.deleted": false,
          deletedAt: null,
        },
        {
          projection: {
            requestsReceived: {
              $elemMatch: { requestId: new ObjectId(requestId) },
            },
            requestsSent: {
              $elemMatch: { requestId: new ObjectId(requestId) },
            },
          },
        },
      );

      if (!user1) {
        throw new UserNotExist(userId);
      }
      const requestReceivedFound = user1.requestsReceived;
      const requestSendFound = user1.requestsSent;

      if (!requestReceivedFound && !requestSendFound) {
        throw new RequestNotExist(requestId);
      }
      session.startTransaction();

      if (requestReceivedFound) {
        await this.userCollection.updateOne(
          { _id: new ObjectId(userId) },
          {
            $pull: {
              requestsReceived: {
                requestId: requestReceivedFound[0].requestId,
              },
            } as any,
          },
          { session },
        );

        await this.userCollection.updateOne(
          { _id: requestReceivedFound[0].user },
          {
            $pull: {
              requestsSent: {
                requestId: requestReceivedFound[0].requestId,
              },
            } as any,
          },
          { session },
        );
      }
      if (requestSendFound) {
        await this.userCollection.updateOne(
          { _id: new ObjectId(userId) },
          {
            $pull: {
              requestsSent: {
                requestId: requestSendFound[0].requestId,
              },
            } as any,
          },
          { session },
        );
        await this.userCollection.updateOne(
          { _id: requestSendFound[0].user },
          {
            $pull: {
              requestsReceived: {
                requestId: requestSendFound[0].requestId,
              },
            } as any,
          },
          { session },
        );
      }

      await session.commitTransaction();
    } catch (e) {
      if (session.inTransaction()) await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }

  async deleteFriend(userId: string, relationId: string): Promise<void> {
    const session = this.client.startSession();

    try {
      const user1 = await this.userCollection.findOne(
        {
          _id: new ObjectId(userId),
          "account.deleted": false,
          "account.state": true,
          deletedAt: null,
        },
        {
          projection: {
            friends: {
              $elemMatch: {
                $or: [
                  {
                    relationId: new ObjectId(relationId),
                  },
                  { user: new ObjectId(relationId) },
                ],
              },
            },
          },
        },
      );

      if (!user1) {
        throw new UserNotExist(userId);
      }

      const relation = user1.friends;

      if (!relation) {
        throw new Error("No existe esta relacion");
      }
      session.startTransaction();
      await this.userCollection.updateOne(
        { _id: new ObjectId(userId) },
        {
          $inc: { "profile.countFriends": -1 },
          $pull: { friends: { relationId: relation[0].relationId } } as any,
        },
        { session },
      );
      const resDb = await this.userCollection.updateOne(
        {
          _id: relation[0].user,
          "account.deleted": false,
        },
        {
          $inc: { "profile.countFriends": -1 },
          $pull: {
            friends: {
              relationId: relation[0].relationId,
            },
          } as any,
        },
        { session },
      );

      if (resDb.matchedCount === 0) {
        throw new UserNotExist();
      }
      await session.commitTransaction();
    } catch (e) {
      if (session.inTransaction()) await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }

  async getFriends(
    userId: string,
    externalUserId: string,
    page: number = 1,
  ): Promise<Array<Friend<string>>> {
    console.log(page);
    const externalUserIdObject: ObjectId | null = ObjectId.isValid(
      externalUserId,
    )
      ? new ObjectId(externalUserId)
      : null;

    const userFriendFound = await this.userCollection.findOne(
      { _id: new ObjectId(userId), "account.deleted": false, deletedAt: null },
      {
        projection: { _id: 1, friends: { $slice: [15 * (page - 1), 15] } },
      },
    );

    if (!userFriendFound) {
      throw new UserNotExist(userId);
    }
    const friendsId = userFriendFound.friends.map((f: any) => f.user);
    const friendsFound = await this.userCollection
      .find(
        {
          $and: [
            { _id: { $in: friendsId } },
            { "account.deleted": false, deletedAt: null },
          ],
        },
        {
          projection: {
            "account.username": 1,
            "profile.avatar.url": 1,
            "profile.checkVerified": 1,
            friends: {
              $elemMatch: {
                user: externalUserIdObject,
              },
            },
            requestsSent: {
              $elemMatch: {
                user: externalUserIdObject,
              },
            },
            requestsReceived: {
              $elemMatch: {
                user: externalUserIdObject,
              },
            },
          },
        },
      )
      .toArray();

    // Mapping friends
    const friendsMapping: Array<Friend<string>> = friendsFound.map(
      (f: any, i: number): Friend<string> => {
        return new Friend<string>(
          f._id.toString() as string,
          String(f.account.username),
          String(f.profile.avatar.url),
          Boolean(f.checkVerified),
          f.friends ? (f.friends[0].relationId as string) : null,
          f.requestsReceived
            ? (f.requestsReceived[0].requestId as string)
            : null,
          f.requestsSent ? (f.requestsSent[0].requestId as string) : null,
        );
      },
    );
    return friendsMapping;
  }

  async getRequests(userId: string): Promise<Array<UserRequesting<string>>> {
    const userFound = await this.userCollection.findOne(
      {
        _id: new ObjectId(userId),
        "account.deleted": false,
        deletedAt: null,
      },

      {
        projection: {
          _id: 1,
          requestsReceived: 1,
        },
      },
    );

    if (!userFound) {
      throw new UserNotExist(userId);
    }

    const userRequestingFound = await this.userCollection
      .find(
        {
          $and: [
            {
              _id: {
                $in: userFound.requestsReceived.map((u: any) => u.user),
              },
            },
            { deletedAt: null },
          ],
        },
        {
          projection: {
            _id: 1,
            "account.username": 1,
            "profile.avatar.url": 1,
            requestsSent: { $elemMatch: { user: new ObjectId(userId) } },
          },
        },
      )
      .toArray();

    const requestsMapping = userRequestingFound.map(
      (u: any): UserRequesting<string> =>
        new UserRequesting<string>(
          u._id.toString() as string,
          u.requestsSent
            ? (u.requestsSent[0].requestId.toString() as string)
            : "",
          u.account.username as string,
          u.profile.avatar.url as string,
        ),
    );

    return requestsMapping;
  }

  async exist(user: UserExistingData): Promise<UserExistingData | undefined> {
    const resDb = await this.userCollection.findOne(
      {
        $and: [
          {
            $or: [
              {
                _id: ObjectId.isValid(user.userId)
                  ? new ObjectId(user.userId)
                  : undefined,
              },
              { "account.email": user.email },
              { "account.username": user.username },
            ],
          },
        ],
      },
      {
        projection: {
          "account.email": 1,
          "account.username": 1,
          "account.state": 1,
        },
      },
    );

    if (!resDb) {
      return undefined;
    }
    return {
      userId: resDb._id.toString(),
      email: resDb.account.email,
      username: resDb.account.username,
    };
  }
}
