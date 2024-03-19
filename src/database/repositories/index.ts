import MongoPostRepository from "./MongoPostRepository";
import MongoUserRepository from "./MongoUserRepository";

import dotenv from "dotenv";

dotenv.config();

import MongoConnection from "../../configs/db_connection_mongo";
import { Connection } from "mongoose";
//import poolLocal from "../../configs/db_connection_local";
const connection: Connection = MongoConnection();

export default {
  userRepository: new MongoUserRepository(connection),
  postRepository: new MongoPostRepository(connection),
};
