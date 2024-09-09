import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
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

const setCookies = (res: NextApiResponse, newConfig: Record<string, string>) => {
  const cookies = Object.entries(newConfig).map(([key, value]) =>
    serialize(key, value, {
      path: '/',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
    })
  );
  res.setHeader('Set-Cookie', cookies);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const newConfig: Record<string, string> = req.body;
      
      if (!newConfig) {
        console.error('Request body is missing.');
        return res.status(400).send('Request body is required.');
      }
      
      const userPublicKey = newConfig.PUBLIC_KEY;

      if (!userPublicKey) {
        console.error('User public key is missing in the request body.');
        return res.status(400).send('User public key is required.');
      }

      const requiredFields = [
        'SOLANA_RPC_ENDPOINT',
        'PRIVATE_KEY',
        'YOURTOKEN_MINT_ADDRESS',
        'PROFIT_WALLET',
        'PUBLIC_KEY',
        'ENABLE_TRADING',
      ];

      for (const field of requiredFields) {
        if (!newConfig[field]) {
          console.error(`${field} is missing in the request body.`);
          return res.status(400).send(`${field} is required.`);
        }
      }

      console.log('Updating Redis with:', newConfig);

      // Use pipeline to delete existing config and set new config atomically
      const pipeline = redis.pipeline();
      pipeline.del(`user:${userPublicKey}:config`);
      pipeline.hmset(`user:${userPublicKey}:config`, newConfig);
      await pipeline.exec();

      setCookies(res, newConfig);
      res.status(200).send('Configuration updated successfully');
    } catch (error) {
      console.error('Error updating configuration:', error);
      res.status(500).send('Failed to update configuration');
    }
  } else {
    console.warn(`Unsupported method: ${req.method}`);
    res.status(405).send('Method Not Allowed');
  }
}
