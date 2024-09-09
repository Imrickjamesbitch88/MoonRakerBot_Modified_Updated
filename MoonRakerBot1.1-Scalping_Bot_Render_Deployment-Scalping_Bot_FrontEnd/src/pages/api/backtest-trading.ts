
import { NextApiRequest, NextApiResponse } from 'next';
import Redis from 'ioredis';
import { parse } from 'cookie';
import Joi from 'joi'; // For input validation

// Initialize Redis connection
const redis = new Redis(process.env.NEXT_PUBLIC_REDIS_URL!);

// Define a schema for request validation using Joi
const backtestSchema = Joi.object({
  strategy: Joi.string().required(), // Assuming 'strategy' is a required field
  startDate: Joi.date().required(), // Example of date validation
  endDate: Joi.date().required().min(Joi.ref('startDate')), // Ensure endDate is after startDate
  parameters: Joi.object().optional() // Optional parameters for the backtest
});

// API Handler for backtesting trading
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Parse cookies to get the user ID
    const cookies = parse(req.headers.cookie || '');
    const userId = cookies.PUBLIC_KEY;

    // Validate the presence of user ID
    if (!userId) {
      return res.status(400).json({ error: 'User ID is not defined in cookies' });
    }

    // Validate incoming request body using Joi schema
    const { error, value } = backtestSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: `Validation error: ${error.details.map(x => x.message).join(', ')}` });
    }

    // Assume some operation with Redis or another service that could fail
    try {
      // Example: Fetch historical data and run a backtest (Pseudo code, replace with actual logic)
      const { strategy, startDate, endDate, parameters } = value;
      
      // Simulate storing the backtest request in Redis
      await redis.hset(`user:${userId}:backtests`, 'latest', JSON.stringify({ strategy, startDate, endDate, parameters }));

      // Return a success response
      res.status(200).json({ message: 'Backtest initiated successfully' });

    } catch (redisError) {
      // Handle Redis-specific errors
      console.error('Redis operation failed:', redisError);
      res.status(500).json({ error: 'Internal Server Error: Failed to initiate backtest' });
    }

  } catch (generalError) {
    // Log and handle any other unexpected errors
    console.error('Unexpected error:', generalError);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
