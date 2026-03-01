import type { NextApiRequest, NextApiResponse } from 'next';
import schoolsJson from '../../../data/schools.json';
import { withMiddleware } from '../../../lib/middleware';
import { getSchoolById } from '../../../lib/db';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const school = await getSchoolById(String(id));
    if (!school) {
      const fallback = (schoolsJson as any[]).find((s) => s.id === id);
      if (!fallback)
        return res.status(404).json({ message: 'School not found' });
      return res.status(200).json(fallback);
    }
    res.status(200).json(school);
  } catch (e) {
    const fallback = (schoolsJson as any[]).find((s) => s.id === id);
    if (!fallback) return res.status(404).json({ message: 'School not found' });
    res.status(200).json(fallback);
  }
}

export default withMiddleware(handler);
