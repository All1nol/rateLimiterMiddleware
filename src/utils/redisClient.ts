import { createClient } from "redis";

let redisClient: any = null;

export async function getRedisClient() {
    if(!redisClient) {
        try{
            redisClient = await createClient({
                url: process.env.REDIS_URL || ""
            })
            .on("error", (err) => console.error("Redis Client Error", err))
            .connect();
        } catch (error) {
            console.error("Error connecting to Redis", error);
            throw error;
        }
    }
    return redisClient;
}