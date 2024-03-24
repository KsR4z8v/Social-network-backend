import { Connection, Types } from "mongoose";
import UserSchema from "../schemasMongo/UserSchema";
import PostSchema from "../schemasMongo/PostSchema";
import UserNotExist from "../../exceptions/UserNotExist";
import RequestNotExist from "../../exceptions/RequestNotExist";
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
      date_born,
      password,
      phone_number,
      avatar: {
        url: url_avatar,
      },
    });
    const resp_db = await user_.save();

    return resp_db._id.toString();
  }

  async find(
    user: string,
    onlyDataExtern: boolean = false,
    id_ext?: string
  ): Promise<Record<string, any>> {
    let extraKeys: Record<string, any> = {
      account_settings: 1,
      phone_number: 1,
      email: 1,
      password: 1,
      date_born: 1,
    };
    if (onlyDataExtern) {
      extraKeys = {
        friends: { $elemMatch: { user: id_ext } },
        requests: { $elemMatch: { user: id_ext } },
        my_requests_sent: { $elemMatch: { user: id_ext } },
      };
    }
    const user_found = await this.userModel.findOne(
      {
        $and: [
          {
            $or: [
              { username: user },
              { email: user },
              { _id: Types.ObjectId.isValid(user) ? user : null },
            ],
          },
          {
            doc_deleted: false,
          },
        ],
      },
      {
        "avatar.url": 1,
        user_preferences: 1,
        fullname: 1,
        username: 1,
        bio: 1,
        verified: 1,
        countPosts: { $size: "$posts" },
        countFriends: { $size: "$friends" },
        ...extraKeys,
      }
    );
    if (!user_found) throw new UserNotExist(user);
    return user_found;
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
      throw new UserNotExist(id_user);
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
      const f = user1.friends.find((f) => f.user.toString() === id_user2);

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
        .findOne({ _id: id_user, doc_deleted: false })
        .select("requests my_requests_sent");
      if (!user1) {
        throw new UserNotExist(id_user);
      }

      const r_r = user1.requests.find((rr) => rr._id.toString() === id_request);
      const r_s = user1.my_requests_sent.find(
        (rs) => rs._id.toString() === id_request
      );

      const q_u1: Record<string, any> = {};
      const q_u2: Record<string, any> = {};

      if (r_r) {
        q_u1.$pullAll = { requests: [r_r] };
        q_u2.$pullAll = {
          my_requests_sent: [{ user: id_user, _id: r_r._id }],
        };
      } else if (r_s) {
        q_u1.$pullAll = { my_requests_sent: [r_s] };
        q_u2.$pullAll = { requests: [{ user: id_user, _id: r_s._id }] };
      } else {
        throw new RequestNotExist(id_request);
      }

      await this.userModel.updateOne({ _id: id_user }, q_u1, { session });
      await this.userModel.updateOne(
        { $or: [{ _id: r_r?.user }, { _id: r_s?.user }] },
        q_u2,
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

  async getRelationFields(
    id_user: string,
    field: "friends" | "requests" | "my_requests_sent",
    id_user_v: string,
    page?: number
  ): Promise<Record<string, any>> {
    const projection: Record<any, any> = {};
    projection[`${field}`] = { $slice: [-10 * (page ? page : 1), 10] };

    const user = await this.userModel
      .findOne(
        {
          _id: id_user,
          doc_deleted: false,
        },
        projection
      )
      .select(field);

    if (!user) {
      throw new UserNotExist(id_user);
    }

    const result = this.userModel.find(
      {
        _id: { $in: user[field].map((f) => f.user) },
      },
      {
        _id: 1,
        username: 1,
        "avatar.url": 1,
        myfriend: { $in: [new Types.ObjectId(id_user_v), `$${field}.user`] },
      }
    );

    return result;
  }

  async exist(
    user: Record<string, string>
  ): Promise<Record<string, any> | null> {
    //*ok
    const user_found = await this.userModel.findOne(
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
        _id: 1,
        email: 1,
        username: 1,
        account_settings: 1,
      }
    );
    return user_found;
  }
}
