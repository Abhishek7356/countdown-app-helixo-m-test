// redisUtils.js
import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});

client.on("error", (err) => console.error("Redis Client Error", err));

await client.connect()
    .then(() => console.log("✅ Connected to Redis!"))
    .catch((err) => console.error("Failed to connect to Redis:", err));


export const setCache = async (key, value, ttl = null) => {
    try {
        if (ttl) {
            await client.set(key, JSON.stringify(value), { EX: ttl });
        } else {
            await client.set(key, JSON.stringify(value));
        }
        return true;
    } catch (err) {
        console.error(`[Redis Set Error] Key: ${key}`, err);
        return false;
    }
};

export const getCache = async (key) => {
    try {
        const data = await client.get(key);
        return data ? JSON.parse(data) : null;
    } catch (err) {
        console.error(`[Redis Get Error] Key: ${key}`, err);
        return null;
    }
};

export const deleteCache = async (key) => {
    try {
        const result = await client.del(key);
        return result > 0;
    } catch (err) {
        console.error(`[Redis Delete Error] Key: ${key}`, err);
        return false;
    }
};

export const clearKeyCaches = async (key) => {
    try {
        const keys = await client.keys(`${key}*`);

        if (keys.length > 0) {
            await client.del(keys);
        } else {
        }
        return true;
    } catch (error) {
        throw error;
    }
};

