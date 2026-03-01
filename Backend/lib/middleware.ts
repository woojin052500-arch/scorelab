import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { isRateLimited } from './rateLimiter';

export function withMiddleware(handler: NextApiHandler) {
  return async function wrapped(req: NextApiRequest, res: NextApiResponse) {
    const origin = req.headers.origin || '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    );

    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    const ip =
      (req.headers['x-forwarded-for'] as string) ||
      req.socket.remoteAddress ||
      'unknown';
    if (isRateLimited(ip)) {
      return res.status(429).json({ error: { message: 'Too many requests' } });
    }

    console.info(
      `${new Date().toISOString()} - ${req.method} ${req.url} - ip=${ip}`
    );

    try {
      return await handler(req, res);
    } catch (err) {
      console.error('Unhandled error in handler', err);
      return res
        .status(500)
        .json({ error: { message: 'Internal server error' } });
    }
  };
}
