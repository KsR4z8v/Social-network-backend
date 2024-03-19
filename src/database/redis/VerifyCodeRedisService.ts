import { RedisClientType } from "redis";
class VerifyCodeRedisService {
  private static instance: VerifyCodeRedisService;
  private client: RedisClientType;
  constructor(client: RedisClientType) {
    this.client = client;
    if (VerifyCodeRedisService.instance) {
      return VerifyCodeRedisService.instance;
    }
    VerifyCodeRedisService.instance = this;
    return this;
  }
  static getInstance() {
    return VerifyCodeRedisService.instance;
  }
  async setVerificationCode(id_user: string, verification_code: string) {
    await this.client.connect();
    await this.client.set(id_user, verification_code, { EX: 60 * 10 });
    await this.client.disconnect();
  }
  async getVerificationCode(id_user: string) {
    const connection = await this.client.connect();
    const data = await connection.get(id_user);
    await connection.disconnect();
    return data;
  }
  async deleteVerificationCode(id_user: string) {
    const connection = await this.client.connect();
    await connection.del(id_user);
    await connection.disconnect();
  }
}
export default VerifyCodeRedisService;
