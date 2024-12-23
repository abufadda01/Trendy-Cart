import Redis from "ioredis"
import dotenv from "dotenv"

dotenv.config()


// redis is a huge data set key&value structure such as hashes (unique keys)
export const redis = new Redis(process.env.UPSTASH_REDIS_URL);

