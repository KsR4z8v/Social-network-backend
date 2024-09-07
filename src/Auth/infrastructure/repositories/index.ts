import { type MongoClient } from "mongodb";
import createClientMongo from "../../../Default/configs/ConnectionMongo";
import type AuthRepository from "../../domain/AuthRepository";
import MongoAuthRepository from "./MongoAuthRepository";

const client: MongoClient = createClientMongo();

export const authRepository: AuthRepository = new MongoAuthRepository(client);
