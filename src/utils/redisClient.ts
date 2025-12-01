import { createClient } from "redis";

const client = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

await client.set("key", "value");
const value = await client.get("key");
client.destroy();

export const RATE_LIMIT = `
    local current 
    current = redis.call("incr", KEYS[1])
    if current == 1 then
        redis.call("expire", KEYS[1], ARGV[1])
    end
    return current
`;

const rateLimit = await client.eval(RATE_LIMIT, {
    keys: ["rate_limit:192.168.1.1"],
    arguments: ['60'],
});

console.log(rateLimit);