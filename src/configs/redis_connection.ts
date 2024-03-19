import { RedisClientType, createClient } from "redis";

export const clientRedis: RedisClientType = createClient({
  url: process.env.URI_REDIS,
});
