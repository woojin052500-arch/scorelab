import type { NextApiRequest, NextApiResponse } from 'next';
import { withMiddleware } from '../../lib/middleware';

function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
}

export default withMiddleware(handler);
