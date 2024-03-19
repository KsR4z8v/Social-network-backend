import app from "./src/app";
import dotenv from "dotenv";
import { clientRedis } from "./src/configs/redis_connection";
import VerifyCodeRedisService from "./src/database/redis/VerifyCodeRedisService";
dotenv.config();

//dataBase redis
new VerifyCodeRedisService(clientRedis);

const PORT = process.env.PORT ?? 8000;

//app
app.listen(PORT, () => {
  console.log(`Server listen on port: ${PORT}`);
});
