import createClientMongo from "../../../Default/configs/ConnectionMongo";
import type LikeRepository from "../../domain/LikeRepository";
import MongoLikeRepository from "./MongoLikeRepository";

const client = createClientMongo();

export const likeRepository: LikeRepository = new MongoLikeRepository(client);
