import { Connection, Types } from "mongoose";
import UserSchema from "../schemasMongo/UserSchema";
import PostSchema from "../schemasMongo/PostSchema";
import UserNotExist from "../../exceptions/UserNotExist";
export default class MongoUserRepository {
  private userModel;
  private postModel;
  private connection: Connection;

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
    date_born: Date,
    url_avatar: string,
    phone_number: string
  ): Promise<string> {
    const user_ = new this.userModel({
      username,
      email,
      fullname,
      bio: " ",
      date_born,
      password,
      phone_number,
      verified: false,
      doc_deleted: false,
      avatar: {
        url: url_avatar,
        id_kit: null,
        format: null,
      },
      account_settings: {
        state_account: true,
        verified_email: false,
      },
      user_preferences: {
        profileView: true,
        receive_requests: true,
      },
    });
    const resp_db = await user_.save();

    return resp_db._id.toString();
  }

  async find(filters: Record<string, string>): Promise<any | null> {
    const resp_db = await this.userModel
      .findOne({
        $and: [
          {
            $or: [
              { username: filters.username },
              { email: filters.email },
              { _id: filters.id_user },
            ],
          },
          {
            doc_deleted: false,
          },
        ],
      })
      .populate("friends.user", "avatar.url username")
      .populate("requests.user", "avatar.url username")
      .populate("posts")
      .populate("my_requests_sent.user", "avatar.url username");
    return resp_db;
  }

  async get(filters: Record<string, string>): Promise<any | null> {
    const resp_db = await this.userModel
      .findOne({
        $and: [
          {
            $or: [
              { username: filters.username },
              { email: filters.email },
              { _id: filters.id_user },
            ],
          },
          {
            doc_deleted: false,
          },
        ],
      })
      .populate("friends.user", "avatar.url username")
      .populate("posts")
      .select(
        "_id username verified fullname avatar.url bio user_preferences.profileView user_preferences.receive_requests friends posts"
      );
    return resp_db;
  }

  async updateData(id_user: string, data: any): Promise<void> {
    let data_: Record<string, any> = {};
    for (const k in data) {
      data_[`${k}`] = data[k];
    }
    const user = await this.userModel
      .findOneAndUpdate({ _id: id_user, doc_deleted: false }, { ...data_ })
      .select("_id");
    if (!user) {
      throw new UserNotExist(id_user);
    }
  }

  async updateAvatar(
    id_user: string,
    data: Record<string, string>
  ): Promise<void> {
    const resp_db = await this.userModel.updateOne(
      { _id: id_user },
      { avatar: data }
    );
    if (resp_db.modifiedCount === 0) {
      throw new Error("No se pudo actualizar");
    }
  }
  async updateSettings(id_user: string, data: any): Promise<void> {
    let data_: Record<string, any> = {};
    for (const k in data) {
      data_[`account_settings.${k}`] = data[k];
    }
    const user = await this.userModel
      .findOneAndUpdate({ _id: id_user, doc_deleted: false }, { ...data_ })
      .select("_id");
    if (!user) {
      throw new UserNotExist(id_user);
    }
  }
  async delete(id_user: string): Promise<void> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const user = await this.userModel.findOneAndUpdate(
        { _id: id_user, doc_deleted: false },
        { doc_deleted: true },
        { session }
      );
      if (!user) {
        throw new UserNotExist(id_user);
      }
      const posts_ = user.posts.map((p) => {
        return { _id: p };
      });

      await this.postModel.updateMany(
        { $or: posts_ },
        { doc_deleted: true },
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
  async sendFriendRequest(
    id_user1: string,
    id_user2: string
  ): Promise<Record<string, any>> {
    const session = await this.connection.startSession();

    try {
      session.startTransaction();
      const user1 = await this.userModel
        .findOne({ _id: id_user1, doc_deleted: false })
        .select("friends requests my_requests_sent");

      const user2 = await this.userModel
        .findOne({ _id: id_user2, doc_deleted: false })
        .select(
          "friends requests my_requests_sent  user_preferences.receive_requests"
        );

      if (!user1 || !user2) {
        throw new UserNotExist(!user1 ? id_user1 : id_user2);
      }

      const res: Record<string, any> = {};
      const f = user1.friends.find((r) => r.user.toString() === id_user2);

      if (f) {
        res["id_relation"] = f._id;
        return res;
      }

      //verifico si existe una solicitud del usuario2 en mis solicitudes
      if (user1.requests.some((r) => r.user.toString() === id_user2)) {
        user1.requests = user1.requests.filter(
          (r) => r.user.toString() !== id_user2
        );
        user2.my_requests_sent = user1.my_requests_sent.filter(
          (r) => r.user.toString() !== id_user1
        );

        const id_relation = new Types.ObjectId();
        res["id_relation"] = id_relation;
        user1.friends.push({ _id: id_relation, user: id_user2 });
        user2.friends.push({ _id: id_relation, user: id_user1 });
      } else if (!user2?.requests.some((r) => r.user.toString() === id_user1)) {
        //en caso contrario verifico que no exista una solicitud y la creo
        if (!(user2.user_preferences as Record<string, any>).receive_requests) {
          throw new Error(
            "El usuario a enviar la solicitud no permite recibir solicitudes debido a su configuracion"
          );
        }
        const id_request = new Types.ObjectId();
        res["id_request"] = id_request;
        user2.requests.push({ _id: id_request, user: user1 });
        user1.my_requests_sent.push({ _id: id_request, user: user2 });
      } else {
        //en caso de que existe lansa una excepcion
        throw new Error("Ya existe la solicitud");
      }
      //guardo los cambios en ambos usuarios
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
  async deleteRequest(id_user: string, id_request: string): Promise<void> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const user1 = await this.userModel
        .findOne({
          $and: [{ _id: id_user }, { doc_deleted: false }],
        })
        .select("requests my_requests_sent");
      if (!user1) {
        throw new UserNotExist(id_user);
      }

      let id_user2;

      if (user1.requests.some((r) => r._id.toString() === id_request)) {
        const r = user1.requests.find((rs) => rs._id.toString() === id_request);
        id_user2 = r.user;
        user1.requests = user1.requests.filter((r) => r._id != id_request);
      }
      if (user1.my_requests_sent.some((r) => r._id.toString() === id_request)) {
        const r = user1.my_requests_sent.find(
          (rs) => rs._id.toString() === id_request
        );
        id_user2 = r.user;
        user1.my_requests_sent = user1.my_requests_sent.filter(
          (r) => r._id != id_request
        );
      }

      const user2 = await this.userModel
        .findOne({
          $and: [{ _id: id_user2 }, { doc_deleted: false }],
        })
        .select("requests my_requests_sent");

      if (!user2) {
        throw new UserNotExist();
      }
      if (user2.requests.some((r) => r._id.toString() === id_request)) {
        user2.requests = user1.requests.filter((r) => r._id != id_request);
      }
      if (user2.my_requests_sent.some((r) => r._id.toString() === id_request)) {
        user2.my_requests_sent = user1.my_requests_sent.filter(
          (r) => r._id != id_request
        );
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
  async deleteFriend(id_user: string, id_relation: string): Promise<void> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const user1 = await this.userModel
        .findOne({
          $and: [{ _id: id_user }, { doc_deleted: false }],
        })
        .select("friends");

      if (!user1) {
        throw new UserNotExist(id_user);
      }
      const f = user1.friends.find((f) => f._id.toString() === id_relation);
      if (!f) {
        throw new Error("No existe esta relacion");
      }
      user1.friends = user1.friends.filter(
        (f) => f._id.toString() !== id_relation
      );
      const user2 = await this.userModel
        .findOneAndUpdate(
          { _id: f.user, doc_deleted: false },
          { $pullAll: { friends: [{ _id: f._id, user: id_user }] } }
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
}
