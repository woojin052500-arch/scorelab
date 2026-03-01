import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const adminKey = process.env.SUBMISSIONS_KEY || '';
  const provided = (req.query.key as string) || '';
  if (adminKey && provided !== adminKey)
    return res.status(403).json({ error: { message: 'Forbidden' } });

  const SUBMISSIONS_PATH = path.join(process.cwd(), 'data', 'submissions.json');
  if (!fs.existsSync(SUBMISSIONS_PATH)) return res.status(200).json([]);
  const raw = fs.readFileSync(SUBMISSIONS_PATH, 'utf-8');
  try {
    const arr = JSON.parse(raw);
    return res.status(200).json(arr);
  } catch (e) {
    return res
      .status(500)
      .json({ error: { message: 'Failed to parse submissions' } });
  }
}

export default withMiddleware(handler);
