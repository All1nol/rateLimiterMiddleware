import type { NextFunction, RequestHandler } from "express";
import type { RateLimitConfig, RateLimitResult } from "../types/index.js";
import { getRedisClient } from "../utils/redisClient.js";
import type { Request, Response } from "express";

export function createRateLimiter(config: RateLimitConfig): RequestHandler{ 
    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            const key= config.keyGenerator ? config.keyGenerator(req) : `rate_limit:${req.ip}`;
            const redisClient = await getRedisClient();
            
            if (!redisClient) {
                console.warn('Redis unavailable, allowing request');
                return next(); // Fail open - allow traffic
            }

            const luaScript = `
                local current = redis.call("INCR", KEYS[1])
                if current = 1 then 
                    redis.call("EXPIRE", KEYS[1], ARGV[1])
                end
                return current
            `;
            
            const result = await redisClient.eval(luaScript, {
                keys: [key],
                arguments: [Math.ceil(config.windowMs / 1000).toString()]
            });

            
        }
}