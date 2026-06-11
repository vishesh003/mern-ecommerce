import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

export const redis = createClient({
  url: process.env.UPSTASH_REDIS_URL,
});

redis.on("error", (err) => {
  console.log("Redis Client Error", err);
});

await redis.connect();

console.log("Redis Connected");