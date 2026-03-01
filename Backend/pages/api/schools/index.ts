import type { NextApiRequest, NextApiResponse } from 'next';
import schoolsJson from '../../../data/schools.json';
import { withMiddleware } from '../../../lib/middleware';
import { getAllSchools } from '../../../lib/db';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const rows = await getAllSchools();
    const list =
      rows && rows.length > 0
        ? rows.map((s: any) => ({
            id: s.id,
            name: s.name,
            type: s.type,
            location: s.location,
          }))
        : (schoolsJson as any[]).map((s) => ({
            id: s.id,
            name: s.name,
            type: s.type,
            location: s.location,
          }));
    res.status(200).json(list);
  } catch (e) {
    const list = (schoolsJson as any[]).map((s) => ({
      id: s.id,
      name: s.name,
      type: s.type,
      location: s.location,
    }));
    res.status(200).json(list);
  }
}

export default withMiddleware(handler);
