
import { NextApiRequest, NextApiResponse } from 'next';
import Redis from 'ioredis';
import { parse } from 'cookie';

// Safely initialize Redis with a fallback or error handling if the environment variable is missing
const redisUrl = process.env.NEXT_PUBLIC_REDIS_URL || 'fallback-redis-url'; // Provide a sensible fallback or handle it more securely
const redis = new Redis(redisUrl);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Parse cookies to get the user ID
    const cookies = parse(req.headers.cookie || '');
    const userId = cookies.PUBLIC_KEY;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is not defined in cookies' });
    }

    // Simulate starting the trading process
    await redis.hset(`user:${userId}:config`, 'ENABLE_TRADING', 'true');

    res.status(200).json({ message: 'Trading started successfully' });
  } catch (error) {
    // Log the error instead of terminating the process
    console.error('Error starting trading:', error);
    res.status(500).json({ error: 'Failed to start trading. Please check the server logs for more details.' });
  }
}
