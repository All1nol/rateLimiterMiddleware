## Rate Limiter Middleware


## What is Rate Limiting? 
User makes 100 reqs in 1 second => block them -> return 429 status

## Possible solutions we can ipmplement

    1. Fixed window 
        Divide time into buckets [0-60s], [60-120s]
        If user makes >10 reqs in a bucket, block it 
        Problem: "edge case" - user can make reqs at 59s and 61s = 20 requests in 2 seconds. 
    
    2. Sliding Window
        Track timestams of each reqs 
        For current reqs, count how many happned in last 60 secs 
        If count >= limit, then reject

    3. Token Bucket
        Imagine a bucket that fills with tokens 
        Each reqs costs 1 token
        Bucket refills N tokens per second 
        If no tokens, block reqs 



## Plan Architecture 

Q1: Where to store req counts? 
    1. In memory object {"192.168.1.1": 45}
    2. Redis string  SET ip:192.168.1.1 45
    3. Redis list LPUSH ip:192.168.1.1 [timestamp1, timestamp2...]


Q2: What data to track?
    1. Fixed window: count + window exp time 
    2. List of reqs timestamps + window size


Q3: How do avoid race conditions? 
    Problem: two requests arrive simultaneosly
        Read count: 9
        BOth increment to 10
        Both pass (should have blocked simultaneosly)
    
    1. Redis INCR is atomic 
    2. Redis Lua scripts for complex operations 


Q4: What is our API look like? 
    Middleware signature: {req,res,next} => void
    Config: limiter({maxRequests:10, windowMs:60000, keyeGenerator: (req) => ...})
    Error Response