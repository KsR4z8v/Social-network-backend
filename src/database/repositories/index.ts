import MongoPostRepository from "./MongoPostRepository";
import MongoUserRepository from "./MongoUserRepository";
import ConnectionMongo from "../../configs/Connectionmongo";
import { type Connection } from "mongoose";

const connection: Connection = ConnectionMongo();

export default {
  userRepository: new MongoUserRepository(connection),
  postRepository: new MongoPostRepository(connection),
};
