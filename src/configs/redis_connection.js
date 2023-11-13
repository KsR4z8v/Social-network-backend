import { createClient } from 'redis'

export const clientRedis = createClient({
    url: process.env.URI_REDIS,
    password: process.env.PASSWORD_REDIS
})
