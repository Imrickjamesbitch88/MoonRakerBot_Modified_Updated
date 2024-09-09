
import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const strategiesDir = path.join(process.cwd(), 'dist', 'strategies');
  const files = fs.readdirSync(strategiesDir).filter(file => file.endsWith('.js'));
  res.status(200).json(files);
}
