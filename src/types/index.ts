import type { Request } from "express";

export interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
    keyGenerator?: (req: Request) => string;
    message?: string;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
}

export interface RateLimitResult{ 
    allowed: boolean;
    remaining: number;
    resetTime: number;
    totalHits: number;
}