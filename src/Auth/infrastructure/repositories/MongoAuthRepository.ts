import { ObjectId, type Collection, type MongoClient } from "mongodb";
import type AuthRepository from "../../domain/AuthRepository";
import UserCredentials from "../../domain/UserCredentials";
import UserNotExist from "../../../Default/domain/exceptions/UserNotExist";

export default class MongoAuthRepository implements AuthRepository {
  private readonly userCollection: Collection;
  constructor(readonly client: MongoClient) {
    this.userCollection = client.db().collection("User");
  }

  async findUserCredentials(
    user: string,
  ): Promise<UserCredentials<string> | null> {
    const userCredentialsFound = await this.userCollection.findOne(
      {
        $and: [
          {
            $or: [
              { _id: ObjectId.isValid(user) ? new ObjectId(user) : undefined },
              { "account.username": user },
              { "account.email": user },
            ],
          },
          {
            "account.deleted": false,
          },
        ],
      },
      {
        projection: {
          _id: 1,
          tracking: 1,
          deletedAt: 1,
          "account.salt": 1,
          "account.password": 1,
          "account.state": 1,
          "account.email": 1,
          "account.username": 1,
          "account.phoneNumber": 1,
          "account.emailVerified": 1,
        },
      },
    );
    if (!userCredentialsFound) {
      return null;
    }
    return new UserCredentials(
      userCredentialsFound._id.toString(),
      String(userCredentialsFound.account.password),
      Boolean(userCredentialsFound.account.emailVerified),
      Boolean(userCredentialsFound.account.state),
      String(userCredentialsFound.account.email),
      String(userCredentialsFound.account.username),
      new Date(),
      [],
      userCredentialsFound.deletedAt
        ? new Date(userCredentialsFound.deletedAt)
        : null,
    );
  }

  async updatePassword(userId: string, password: string): Promise<void> {
    const respDb = await this.userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { "account.password": password } },
    );
    if (respDb.matchedCount === 0) {
      throw new UserNotExist(userId);
    }
  }

  async activateAccount(userId: string) {
    const respDb = await this.userCollection.updateOne(
      { _id: new ObjectId(userId), "account.deleted": false },
      {
        $set: {
          deletedAt: null,
          "account.state": true,
        },
      },
    );
    if (respDb.matchedCount === 0) {
      throw new UserNotExist(userId);
    }
  }

  async setVerifyEmail(userId: string): Promise<void> {
    const resDb = await this.userCollection.updateOne(
      {
        _id: new ObjectId(userId),
      },
      {
        $set: {
          "account.emailVerified": true,
        },
      },
    );
    if (resDb.matchedCount === 0) {
      throw new UserNotExist(userId);
    }
  }
}
