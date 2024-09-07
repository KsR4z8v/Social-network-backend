import { type MongoClient } from "mongodb";
import MongoPostRepository from "./MongoPostRepository";
import createClientMongo from "../../../Default/configs/ConnectionMongo";
import type PostRepository from "../../domain/PostRepository";

const client: MongoClient = createClientMongo();

export const postRepository: PostRepository = new MongoPostRepository(client);
