import app from "./src/app";
import dotenv from "dotenv";
import redisClient from "./src/configs/ConnectionRedis";
import VerifyCodeRedisService from "./src/database/redis/VerifyCodeRedisService";
import ApiGoogleEmailService from "./src/services/sendEmailGoogle.service";
dotenv.config({ path: ".develop.env" });

const initServices = (): void => {
  // dataBase redis
  void new VerifyCodeRedisService(redisClient);

  void new ApiGoogleEmailService(
    process.env.ID_CLIENT ?? " ",
    process.env.SECRET_CLIENT ?? " ",
    process.env.REFRESH_TOKEN_GOOGLE ?? " ",
  );
};

initServices();

const PORT = process.env.PORT ?? 8000;

// app
app.listen(PORT, () => {
  console.log(`Server listen on port: ${PORT}`);
});
