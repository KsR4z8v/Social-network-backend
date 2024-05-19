import MongoPostRepository from "./MongoPostRepository";
import MongoUserRepository from "./MongoUserRepository";
import ConnectionMongo from "../../configs/ConnectionMongo";
import { type Connection } from "mongoose";
import UserSchema from "../models/UserSchema";
import PostSchema from "../models/PostSchema";

const connection: Connection = ConnectionMongo();
const postModel = connection.model("Post", PostSchema, "Post");
const userModel = connection.model("User", UserSchema, "User");

export default {
  userRepository: new MongoUserRepository(connection, userModel, postModel),
  postRepository: new MongoPostRepository(connection, postModel, userModel),
};
