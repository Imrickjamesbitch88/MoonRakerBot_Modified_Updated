import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
      const userId = req.cookies.PUBLIC_KEY;  // Assuming the user's public key is stored in cookies

      if (!userId) {
        return res.status(400).send('User ID is required');
      }

      const response = await axios.get(`${backendUrl}/api/is-trading`, { params: { userId } });

      res.status(200).json({ isRunning: response.data.isTrading });
    } catch (error) {
      console.error('Error checking trading state:', error);
      res.status(500).send('Failed to check trading state');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
