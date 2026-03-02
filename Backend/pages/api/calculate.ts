import type { NextApiRequest, NextApiResponse } from 'next';
import schoolsJson from '../../data/schools.json';
import { calculateForSchool } from '../../lib/calc';
import { CalculateRequestSchema } from '../../lib/validation';
import fs from 'fs';
import path from 'path';
import { withMiddleware } from '../../lib/middleware';
import * as crypto from 'node:crypto'; 
import { getAllSchools } from '../../lib/db';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const parse = CalculateRequestSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid payload' });

  const { userScore, save, consent, difficultyMode } = parse.data;

  let schools: any[] = [];
  try {
    const dbSchools = await getAllSchools() || [];
    const jsonSchools = schoolsJson as any[];
    const schoolMap = new Map();
    [...jsonSchools, ...dbSchools].forEach(s => schoolMap.set(s.id, s));
    schools = Array.from(schoolMap.values());
  } catch (e) {
    schools = schoolsJson as any[];
  }

  const results = schools.map((s: any) => ({
    ...calculateForSchool(s, userScore, { difficultyMode }),
    schoolId: s.id 
  }));

  results.sort((a, b) => b.finalScore - a.finalScore);

  if (save && consent) {
    try {
      const SUBMISSIONS_PATH = path.join(process.cwd(), 'data', 'submissions.json');
      let arr = fs.existsSync(SUBMISSIONS_PATH) ? JSON.parse(fs.readFileSync(SUBMISSIONS_PATH, 'utf-8')) : [];
      arr.push({ createdAt: new Date().toISOString(), userScore, results });
      fs.writeFileSync(SUBMISSIONS_PATH, JSON.stringify(arr, null, 2));
    } catch (e) { console.error(e); }
  }

  res.status(200).json(results);
}
export default withMiddleware(handler);