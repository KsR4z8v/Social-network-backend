import app from "./src/app";
import dotenv from "dotenv";
import { clientRedis } from "./src/configs/redis_connection";
import VerifyCodeRedisService from "./src/database/redis/VerifyCodeRedisService";
import ApiGoogleEmailService from "./src/services/sendEmailGoogle.service";
dotenv.config();

//dataBase redis
new VerifyCodeRedisService(clientRedis);

new ApiGoogleEmailService(
  process.env.ID_CLIENT,
  process.env.SECRET_CLIENT,
  process.env.ACCESS_TOKEN_GOOGLE
);

const PORT = process.env.PORT ?? 8000;

//app
app.listen(PORT, () => {
  console.log(`Server listen on port: ${PORT}`);
});
