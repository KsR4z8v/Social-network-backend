import MongoUserRepository from "./MongoUserRepository";
import createClientMongo from "../../../Default/configs/ConnectionMongo";
import { type MongoClient } from "mongodb";
import type UserRepository from "../../domain/UserRepository";
const client: MongoClient = createClientMongo();

export const userRepository: UserRepository = new MongoUserRepository(client);

// void testRepository();
