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
  if (req.method === 'GET') {
    try {
      const { userId } = req.query;

      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'User ID is required' });
      }

      // Fetch logs from Redis
      const logs = await redis.lrange(`user:${userId}:logs`, 0, -1);

      if (!logs || logs.length === 0) {
        return res.status(404).json({ error: 'No logs found' });
      }

      res.status(200).json({ logs });
    } catch (error) {
      console.error('Error fetching logs from Redis:', error);
      res.status(500).json({ error: 'Failed to fetch logs' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
