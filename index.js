import app from "./src/app.js";
import dotenv from "dotenv"
import { clientRedis } from './src/configs/redis_connection.js'
import VerifyCodeRedisService from './src/database/redis/VerifyCodeRedisService.js'
new VerifyCodeRedisService(clientRedis)

dotenv.config()
const PORT = process.env.PORT ?? 8000

app.listen(PORT, () => [
    console.log(`Server listen on port: ${PORT}`)
]);