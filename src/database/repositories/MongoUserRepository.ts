/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Connection, Types, type Model } from "mongoose";

import UserNotExist from "../../exceptions/UserNotExist";
import RequestNotExist from "../../exceptions/RequestNotExist";
import type UserInterface from "../models/UserInterface";
import { type Avatar } from "../models/UserInterface";
import type AccountSettings from "../models/AccountSettings";
import { type UserDocument } from "../models/UserSchema";
import { type PostDocument } from "../models/PostSchema";

export default class MongoUserRepository {
  constructor(
    readonly connection: Connection,
    readonly userModel: Model<UserDocument>,
    readonly postModel: Model<PostDocument>,
  ) {}

  async create(
    username: string,
    email: string,
    fullname: string,
    password: string,
    dateBorn: Date,
    urlAvatar: string,
    phoneNumber: string,
  ): Promise<string> {
    const user_ = new this.userModel({
      username,
      email,
      fullname,
      date_born: dateBorn,
      password,
      phone_number: phoneNumber,
      avatar: {
        url: urlAvatar,
      },
    });
    const respDb = await user_.save();

    return respDb._id.toString();
  }

  async find(
    user: string,
    idExt?: string,
  ): Promise<UserInterface<Types.ObjectId>> {
    // console.log(idExt);
    const projection: Record<string, unknown> = {
      account_settings: 1,
      phone_number: 1,
      email: 1,
      date_born: 1,
      "avatar.url": 1,
      password: 1,
      user_preferences: 1,
      fullname: 1,
      username: 1,
      bio: 1,
      verified: 1,
      countPosts: 1,
      countFriends: 1,
      friends: { $elemMatch: { user: idExt } },
      requests: { $elemMatch: { user: idExt } },
      my_requests_sent: { $elemMatch: { user: idExt } },
    };

    const resDb = await this.userModel.findOne(
      {
        $and: [
          {
            $or: [
              { username: user },
              { email: user },
              {
                _id: Types.ObjectId.isValid(user) ? user : null,
              },
            ],
          },
          {
            doc_deleted: false,
          },
        ],
      },
      projection,
    );
    if (!resDb) throw new UserNotExist(user);
    return resDb;
  }

  async updateData(
    idUser: string,
    data: Record<string, unknown>,
  ): Promise<void> {
    const data_: Record<string, unknown> = {};
    for (const k in data) {
      data_[`${k}`] = data[k];
    }
    const user = await this.userModel
      .findOneAndUpdate({ _id: idUser, doc_deleted: false }, { ...data_ })
      .select("_id");
    if (!user) {
      throw new UserNotExist(idUser);
    }
  }

  async updateAvatar(idUser: string, avatar: Avatar): Promise<void> {
    const resDb = await this.userModel.updateOne({ _id: idUser }, { avatar });
    if (resDb.modifiedCount === 0) {
      throw new UserNotExist(idUser);
    }
  }

  async updateSettings(
    idUser: string,
    data: Record<string, unknown>,
  ): Promise<void> {
    const data_: Record<string, unknown> = {};
    for (const k in data) {
      data_[`account_settings.${k}`] = data[k];
    }
    const user = await this.userModel
      .findOneAndUpdate({ _id: idUser, doc_deleted: false }, { ...data_ })
      .select("_id");
    if (!user) {
      throw new UserNotExist(idUser);
    }
  }

  async delete(idUser: string): Promise<void> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const user = await this.userModel.findOneAndUpdate(
        { _id: idUser, doc_deleted: false },
        { doc_deleted: true },
        { session },
      );
      if (!user) {
        throw new UserNotExist(idUser);
      }
      const posts_ = user.posts.map((p) => {
        return { _id: p };
      });

      await this.postModel.updateMany(
        { $or: posts_ },
        { doc_deleted: true },
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

  async sendFriendRequest(
    idUser1: string,
    idUser2: string,
  ): Promise<Record<string, string>> {
    const session = await this.connection.startSession();

    try {
      session.startTransaction();
      const user1 = await this.userModel.findOne(
        { _id: idUser1, doc_deleted: false },
        {
          friends: { $elemMatch: { user: idUser2 } },
          requests: { $elemMatch: { user: idUser2 } },
          my_requests_sent: { $elemMatch: { user: idUser2 } },
        },
        { session },
      );
      const user2 = await this.userModel
        .findOne({ _id: idUser2, doc_deleted: false })
        .select("user_preferences.receive_requests");

      if (!user1 || !user2) {
        throw new UserNotExist(!user1 ? idUser1 : idUser2);
      }

      let objectResponse;
      if (user1.friends[0]) {
        objectResponse = { id_relation: user1.friends[0]._id.toString() };
      }

      if (user1.my_requests_sent[0]) {
        throw new Error("Ya has enviado una solicitud a este usuario");
      }
      const requestFound = user1.requests[0];

      if (requestFound) {
        // si ya existe una solicitud enviada por el, se acepta y se forma una relacion de amistad
        await Promise.all([
          this.userModel.updateOne(
            { _id: idUser2 },
            {
              $pullAll: {
                my_requests_sent: [{ _id: requestFound._id, user: idUser1 }],
              },
            },
            { session },
          ),
          this.userModel.updateOne(
            { _id: idUser1 },
            { $pullAll: { requests: [requestFound] } },
            { session },
          ),

          this.userModel.updateOne(
            { _id: idUser1 },
            { $inc: { countFriends: 1 }, $push: { friends: [requestFound] } },
            { session },
          ),
          this.userModel.updateOne(
            { _id: idUser2 },
            {
              $inc: { countFriends: 1 },
              $push: { friends: [{ _id: requestFound._id, user: idUser1 }] },
            },
            { session },
          ),
        ]);
        objectResponse = { id_relation: requestFound._id.toString() };
      } else {
        if (!user2.user_preferences.receive_requests) {
          throw new Error(
            "El usuario no tiene permitido el envio de solicitudes",
          );
        }
        const idRequest = new Types.ObjectId();

        await Promise.all([
          this.userModel.updateOne(
            { _id: idUser1 },
            { $push: { my_requests_sent: { _id: idRequest, user: idUser2 } } },
            { session },
          ),
          this.userModel.updateOne(
            { _id: idUser2 },
            { $push: { requests: { _id: idRequest, user: idUser1 } } },
            { session },
          ),
        ]);
        objectResponse = { id_request: idRequest.toString() };
      }
      await session.commitTransaction();

      return objectResponse;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }

  // *OK
  async deleteRequest(idUser: string, idRequest: string): Promise<void> {
    const session = await this.connection.startSession();

    try {
      session.startTransaction();
      const user1 = await this.userModel.findOne(
        { _id: idUser, doc_deleted: false },
        {
          requests: { $elemMatch: { _id: idRequest } },
          my_requests_sent: { $elemMatch: { _id: idRequest } },
        },
        { session },
      );

      if (!user1) {
        throw new UserNotExist(idUser);
      }
      const requestFound = user1.requests[0];
      const requestSendFound = user1.my_requests_sent[0];

      if (!requestFound && !requestSendFound) {
        throw new RequestNotExist();
      }

      if (requestFound) {
        await Promise.all([
          this.userModel.updateOne(
            { _id: idUser },
            { $pullAll: { requests: [requestFound] } },
            { session },
          ),
          this.userModel.updateOne(
            { _id: requestFound.user },
            {
              $pullAll: {
                my_requests_sent: [{ _id: requestFound._id, user: idUser }],
              },
            },
            { session },
          ),
        ]);
      }
      if (requestSendFound) {
        await Promise.all([
          this.userModel.updateOne(
            { _id: idUser },
            { $pullAll: { my_requests_sent: [requestSendFound] } },
            { session },
          ),
          this.userModel.updateOne(
            { _id: requestSendFound.user },
            {
              $pullAll: {
                requests: [{ _id: requestSendFound._id, user: idUser }],
              },
            },
            { session },
          ),
        ]);
      }

      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }

  async deleteFriend(idUser: string, idRelation: string): Promise<void> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const user1 = await this.userModel.findOne(
        {
          $and: [{ _id: idUser }, { doc_deleted: false }],
        },
        { friends: { $elemMatch: { _id: idRelation } } },
        { session },
      );

      if (!user1) {
        throw new UserNotExist(idUser);
      }

      const relation = user1.friends[0];

      if (!relation) {
        throw new Error("No existe esta relacion");
      }

      await Promise.all([
        this.userModel.updateOne(
          { _id: idUser },
          { $inc: { countFriends: -1 }, $pullAll: { friends: [relation] } },
          { session },
        ),
        this.userModel.updateOne(
          { _id: relation.user },
          {
            $inc: { countFriends: -1 },
            $pullAll: { friends: [{ _id: relation._id, user: idUser }] },
          },
          { session },
        ),
      ]);

      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }

  async getRelationFields(
    idUser: string,
    field: "friends" | "requests" | "my_requests_sent",
    idUserView: string,
    page: number = 1,
  ): Promise<Array<UserInterface<Types.ObjectId>>> {
    const projection: Record<string, unknown> = {};

    projection[`${field}`] = { $slice: [-10 * page, 10] };

    const user = await this.userModel
      .findOne(
        {
          _id: idUser,
          doc_deleted: false,
        },
        projection,
      )
      .select(field);

    if (!user) {
      throw new UserNotExist(idUser);
    }

    const result = await this.userModel.find(
      {
        _id: { $in: user[field].map((f) => f.user) },
      },
      {
        _id: 1,
        username: 1,
        "avatar.url": 1,
        friends: {
          $elemMatch: { user: idUserView },
        },
        requests: {
          $elemMatch: { user: idUserView },
        },
        my_requests_sent: {
          $elemMatch: { user: idUserView },
        },
      },
    );

    return result;
  }

  async exist(user: Record<string, string>): Promise<
    | {
        username: string;
        id: string;
        email: string;
        account_settings: AccountSettings;
      }
    | undefined
  > {
    // *ok
    const resDb = await this.userModel.findOne(
      {
        $and: [
          {
            $or: [
              {
                _id: Types.ObjectId.isValid(user.id_user) ? user.id_user : null,
              },
              { email: user.email },
              { username: user.username },
            ],
          },
          { doc_deleted: false },
        ],
      },
      {
        email: 1,
        username: 1,
        account_settings: 1,
      },
    );

    if (resDb) {
      return {
        id: resDb._id.toString(),
        email: resDb.email,
        username: resDb.username,
        account_settings: resDb.account_settings,
      };
    }
  }
}
