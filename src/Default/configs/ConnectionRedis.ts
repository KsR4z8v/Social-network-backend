import { type RedisClientType, createClient } from "redis";

const redisClient: RedisClientType = createClient({
  url: process.env.URI_REDIS,
});

redisClient.on("error", (error) => {
  console.error(`Redis client error:`, error);
});

redisClient.on("connect", () => {
  console.info(`Redis client connect`);
});

export default redisClient;
