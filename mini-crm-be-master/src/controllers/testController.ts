import { Request, Response } from 'express';
import redis from '../config/redisClient';
import { getMySQLConnection } from '../config/mysqlClient';  // Import MySQL connection function

export const testRedisConnection = async (req: Request, res: Response) => {
  try {
    // Set a key in Redis
    await redis.set('testKey', 'Hello from Redis!');
    // Get the value back from Redis
    const value = await redis.get('testKey');
    res.send(`Got value from Redis: ${value}`);
  } catch (err) {
    console.error('Error with Redis operation:', err);
    res.status(500).send('Error connecting to Redis');
  }
};

// Test MySQL connection
export const testMySQLConnection = async (req: Request, res: Response) => {
  try {
    await getMySQLConnection();  // Attempt to connect to MySQL
    res.send('MySQL connection successful!');
  } catch (err) {
    console.error('MySQL connection error:', err);
    res.status(500).send('Error connecting to MySQL');
  }
};
