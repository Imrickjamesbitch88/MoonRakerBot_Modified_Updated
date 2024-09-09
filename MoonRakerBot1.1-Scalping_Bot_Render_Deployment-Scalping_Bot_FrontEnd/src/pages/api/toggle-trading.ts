import { NextApiRequest, NextApiResponse } from 'next';
import Redis from 'ioredis';


// Correctly access the environment variable
const redisUrl = process.env.NEXT_PUBLIC_REDIS_URL;

// Check if the environment variable is set
if (!redisUrl) {
  console.error('NEXT_PUBLIC_REDIS_URL is not defined.');
  process.exit(1); // Exit the process if the Redis URL is not set
}

// Initialize Redis with the URL from the environment variable
const redis = new Redis(redisUrl);


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { userId, enable } = req.body;

      if (!userId) {
        throw new Error('User ID is required');
      }

      // Check if the user config already exists in Redis
      const userExists = await redis.exists(`user:${userId}:config`);
      
      if (!userExists) {
        // If the user config doesn't exist, initialize it
        await redis.hset(`user:${userId}:config`, {
          ENABLE_TRADING: enable.toString(),
        });
        console.log(`User config initialized for userId: ${userId}`);
      } else {
        // If it does exist, simply update the ENABLE_TRADING field
        await redis.hset(`user:${userId}:config`, 'ENABLE_TRADING', enable.toString());
        console.log(`Trading ${enable ? 'enabled' : 'disabled'} for userId: ${userId}`);
      }

      res.status(200).send(`Trading ${enable ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Error toggling trading state:', error);
      res.status(500).send('Failed to toggle trading state');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
