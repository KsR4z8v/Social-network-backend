import { type RedisClientType } from "redis";

class VerifyCodeRedisService {
  private static instance: VerifyCodeRedisService;

  constructor(readonly client: RedisClientType) {
    if (VerifyCodeRedisService.instance instanceof VerifyCodeRedisService) {
      return VerifyCodeRedisService.instance;
    }
    VerifyCodeRedisService.instance = this;
    return this;
  }

  static getInstance(): VerifyCodeRedisService {
    return VerifyCodeRedisService.instance;
  }

  async setVerificationCode(
    idUser: string,
    verificationCode: string,
  ): Promise<void> {
    const connection = await this.client.connect();
    await connection.set(idUser, verificationCode, { EX: 60 * 10 });
    await connection.disconnect();
  }

  async getVerificationCode(idUser: string): Promise<string | null> {
    const connection = await this.client.connect();
    const data = await connection.get(idUser);
    await connection.disconnect();
    return data;
  }

  async deleteVerificationCode(idUser: string): Promise<void> {
    const connection = await this.client.connect();
    await connection.del(idUser);
    await connection.disconnect();
  }
}
export default VerifyCodeRedisService;
