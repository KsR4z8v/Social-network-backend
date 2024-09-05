import { type RedisClientType } from "redis";
import redisClient from "../../configs/ConnectionRedis";
import type StoreCacheRepository from "../../domain/StoreCacheRepository";
import RedisStorageCacheRepository from "./RedisStoreCacheRepository";

const client: RedisClientType = redisClient;

export const storeCacheRepository: StoreCacheRepository =
  new RedisStorageCacheRepository(client);
