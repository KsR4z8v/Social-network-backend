import { createClient } from 'redis'

export const clientRedis = createClient({
    url: "rediss://snapwire.redis.cache.windows.net:6380",
    password: 'SiZTl2kmdHdJI2QlTa6THyXdMHrWvopNqAzCaGr5aJo='
})
