import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config(); // Load the .env file

// Retrieve values from environment variables
const redisHost =
  process.env.NODE_ENV === "production"
    ? process.env.REDIS_CLOUD_HOST
    : process.env.REDIS_HOST;

const redisPort =
  process.env.NODE_ENV === "production"
    ? parseInt(process.env.REDIS_CLOUD_PORT!, 10)
    : process.env.REDIS_PORT
    ? parseInt(process.env.REDIS_PORT, 10)
    : 6379; // Default to 6379 if not specified

const redisPassword =
  process.env.NODE_ENV === "production"
    ? process.env.REDIS_CLOUD_PASSWORD
    : process.env.REDIS_PASSWORD;

if (!redisHost) {
  throw new Error(
    "Missing required Redis host configuration in environment variables."
  );
}

// Create Redis clients for different use cases
export const redisSubscriber = new Redis({
  host: redisHost,
  port: redisPort,
  password: redisPassword || undefined,
});

export const redisPublisher = new Redis({
  host: redisHost,
  port: redisPort,
  password: redisPassword || undefined,
});

// General-purpose Redis client (optional)
const redisClient = new Redis({
  host: redisHost,
  port: redisPort,
  password: redisPassword || undefined,
});

// Attach event listeners for debugging purposes
redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Error connecting to Redis:", err);
});

// Export the general-purpose client as default
export default redisClient;
