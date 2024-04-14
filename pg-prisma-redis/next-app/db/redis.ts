import { createClient } from 'redis'

const redisClientSingleton = () => {
    const redis = createClient({
        url: process.env.REDIS_URL as string
    })
    redis.on('error', (err) => console.log('Redis Client Error', err));

    return redis
}

declare global {
    var redisGlobal: undefined | ReturnType<typeof redisClientSingleton>
}

const redis = globalThis.redisGlobal ?? redisClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.redisGlobal = redis

export async function ensureRedisConnected() {
    const redis = globalThis.redisGlobal
    if (!redis || redis.isOpen) return
    await redis.connect()
}

export default redis

import { Schema, Repository } from 'redis-om'

const sessionSchema = new Schema('userSession', {
    sessionToken: { type: 'string' },
    userId: { type: 'string' },
    expires: { type: 'date' },
    userName: { type: 'string' },
    userEmail: { type: 'string' },
    userImage: { type: 'string' },
    userEmailVerified: { type: 'date' },
})

export const sessionRepository = new Repository(sessionSchema, redis)
