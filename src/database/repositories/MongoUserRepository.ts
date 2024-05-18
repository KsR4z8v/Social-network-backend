import { type Connection, Types } from "mongoose";
import UserSchema from "../schemasMongo/UserSchema";
import PostSchema from "../schemasMongo/PostSchema";
import UserNotExist from "../../exceptions/UserNotExist";
import RequestNotExist from "../../exceptions/RequestNotExist";
import User from "../models/User";
import { type Avatar } from "../models/User";
import type UserPreferences from "../models/UserPreferences";
import type AccountSettings from "../models/AccountSettings";

export default class MongoUserRepository {
  private readonly userModel;
  private readonly postModel;
  private readonly connection: Connection;

  constructor(connection: Connection) {
    this.userModel = connection.model("User", UserSchema, "User");
    this.postModel = connection.model("Post", PostSchema, "Post");
    this.connection = connection;
  }

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

  async find(user: string, idExt?: string): Promise<User> {
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
    // console.log(resDb);
    if (!resDb) throw new UserNotExist(user);

    const userDb: User = new User(
      resDb._id.toString(),
      resDb.username as string,
      resDb.email as string,
      resDb.password as string,
      resDb.bio as string,
      resDb.avatar as Avatar,
      resDb.verified as boolean,
      resDb.fullname as string,
      resDb.date_born as Date,
      resDb.phone_number as string,
      resDb.countPosts as number,
      resDb.countFriends as number,
      resDb.user_preferences as UserPreferences,
      resDb.account_settings as AccountSettings,
      resDb.friends[0]
        ? { id_relation: resDb.friends[0]._id.toString() }
        : null,
      resDb.requests[0]
        ? { id_request: resDb.requests[0]._id.toString() }
        : null,
      resDb.my_requests_sent[0]
        ? { id_request: resDb.my_requests_sent[0]._id.toString() }
        : null,
    );

    return userDb;
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
  ): Promise<Record<string, unknown>> {
    const session = await this.connection.startSession();

    try {
      session.startTransaction();
      const user1 = await this.userModel
        .findOne({ _id: idUser1, doc_deleted: false })
        .select("friends requests my_requests_sent");

      const user2 = await this.userModel
        .findOne({ _id: idUser2, doc_deleted: false })
        .select(
          "friends requests my_requests_sent  user_preferences.receive_requests",
        );

      if (!user1 || !user2) {
        throw new UserNotExist(!user1 ? idUser1 : idUser2);
      }

      const res: Record<string, unknown> = {};

      const alreadyFriend = user1.friends.find(
        (f) => f.user.toString() === idUser2,
      );

      if (alreadyFriend) {
        res.id_relation = alreadyFriend._id;
        return res;
      }

      // verifico si existe una solicitud del usuario2 en mis solicitudes

      if (user1.requests.some((r) => r.user.toString() === idUser2)) {
        user1.requests = user1.requests.filter(
          (r) => r.user.toString() !== idUser2,
        );
        user2.my_requests_sent = user1.my_requests_sent.filter(
          (r) => r.user.toString() !== idUser1,
        );

        const idRelation = new Types.ObjectId();

        res.id_relation = idRelation;

        user1.friends.push({ _id: idRelation, user: idUser2 });
        user2.friends.push({ _id: idRelation, user: idUser1 });
      } else if (!user2?.requests.some((r) => r.user.toString() === idUser1)) {
        // en caso contrario verifico que no exista una solicitud y la creo

        if (
          !(user2.user_preferences as Record<string, unknown>).receive_requests
        ) {
          throw new Error(
            "El usuario a enviar la solicitud no permite recibir solicitudes debido a su configuracion",
          );
        }

        const idRequest = new Types.ObjectId();
        res.id_request = idRequest;
        user2.requests.push({ _id: idRequest, user: user1 });
        user1.my_requests_sent.push({
          _id: idRequest,
          user: user2,
        });
      } else {
        // en caso de que existe lanza una excepcion

        throw new Error("Ya existe la solicitud");
      }
      // guardo los cambios en ambos usuarios

      await user1.save({ session });
      await user2.save({ session });
      await session.commitTransaction();
      return res;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }

  // TODO improve logic
  async deleteRequest(idUser: string, idRequest: string): Promise<void> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const user1 = await this.userModel
        .findOne(
          { _id: idUser, doc_deleted: false },
          { requests: 1, my_requests_sent: 1 },
        )
        .select("requests my_requests_sent");

      if (!user1) {
        throw new UserNotExist(idUser);
      }

      const requestUser1 = user1.requests.find(
        (r) => r._id.toString() === idRequest,
      );
      const requestSentUser1 = user1.my_requests_sent.find(
        (r) => r._id.toString() === idRequest,
      );

      const queryUser1: Record<string, unknown> = {};

      const queryUser2: Record<string, unknown> = {};

      if (requestUser1) {
        queryUser1.$pullAll = { requests: [requestUser1] };
        queryUser2.$pullAll = {
          my_requests_sent: [{ user: idUser, _id: requestUser1._id }],
        };
      } else if (requestSentUser1) {
        queryUser1.$pullAll = {
          my_requests_sent: [requestSentUser1],
        };
        queryUser2.$pullAll = {
          requests: [{ user: idUser, _id: requestSentUser1._id }],
        };
      } else {
        throw new RequestNotExist(idRequest);
      }

      await this.userModel.updateOne({ _id: idUser }, queryUser1, {
        session,
      });
      await this.userModel.updateOne(
        {
          $or: [{ _id: requestUser1?.user }, { _id: requestSentUser1?.user }],
        },
        queryUser2,
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

  async deleteFriend(idUser: string, idRelation: string): Promise<void> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const user1 = await this.userModel
        .findOne({
          $and: [{ _id: idUser }, { doc_deleted: false }],
        })
        .select("friends");

      if (!user1) {
        throw new UserNotExist(idUser);
      }
      const f = user1.friends.find(
        (f) =>
          f._id.toString() === idRelation || f.user.toString() === idRelation,
      );
      if (!f) {
        throw new Error("No existe esta relacion");
      }
      user1.friends = user1.friends.filter(
        (f) => f._id.toString() !== idRelation,
      );
      const user2 = await this.userModel
        .findOneAndUpdate(
          { _id: f.user, doc_deleted: false },
          {
            $pullAll: {
              friends: [{ _id: f._id, user: idUser }],
            },
          },
        )
        .select("friends");

      if (!user2) {
        throw new UserNotExist();
      }

      await user1.save({ session });
      await user2.save({ session });
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
    page?: number,
  ): Promise<unknown> {
    const projection: Record<string, unknown> = {};

    projection[`${field}`] = { $slice: [-10 * (page ?? 1), 10] };

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
        myfriend: {
          $in: [new Types.ObjectId(idUserView), `$friends.user`],
        },
        requestSent: {
          $in: [new Types.ObjectId(idUserView), `$requests.user`],
        },
        requestReceived: {
          $in: [new Types.ObjectId(idUserView), `$my_requests_sent.user`],
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
        email: resDb.email as string,
        username: resDb.username as string,
        account_settings: resDb.account_settings as AccountSettings,
      };
    }
  }
}
