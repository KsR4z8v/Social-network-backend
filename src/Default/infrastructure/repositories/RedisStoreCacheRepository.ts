import { type RedisClientType } from "redis";
import type StoreCacheRepository from "../../domain/StoreCacheRepository";

class RedisStorageCacheRepository implements StoreCacheRepository {
  constructor(private readonly client: RedisClientType) {}

  private async verifyAndOpenClient(): Promise<void> {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  async set(key: string, value: string): Promise<void> {
    await this.verifyAndOpenClient();
    await this.client.set(key, value, { EX: 60 * 10 });
  }

  async get(key: string): Promise<string | null> {
    await this.verifyAndOpenClient();
    const data = await this.client.get(key);
    return data;
  }

  async delete(key: string): Promise<void> {
    await this.verifyAndOpenClient();
    await this.client.del(key);
  }
}
export default RedisStorageCacheRepository;
