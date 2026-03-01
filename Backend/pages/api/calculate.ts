dotenv.config();

import type { NextApiRequest, NextApiResponse } from 'next';
import schoolsJson from '../../data/schools.json';
import { calculateForSchool } from '../../lib/calc';
import { CalculateRequestSchema } from '../../lib/validation';
import fs from 'fs';
import path from 'path';
import { withMiddleware } from '../../lib/middleware';
import crypto from 'crypto';
import { getAllSchools } from '../../lib/db';
import dotenv from 'dotenv';

dotenv.config();

function apiError(res: NextApiResponse, status: number, message: string) {
  return res.status(status).json({ error: { message } });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return apiError(res, 405, 'Method not allowed');

  const parse = CalculateRequestSchema.safeParse(req.body);
  if (!parse.success) return apiError(res, 400, 'Invalid request payload');

  const { userScore, save, consent, difficultyMode } = parse.data;

  let schools: any[] = [];
  try {
    const rows = await getAllSchools();
    schools = rows && rows.length > 0 ? rows : (schoolsJson as any[]);
  } catch (e) {
    schools = schoolsJson as any[];
  }

  const results = schools.map((s: any) =>
    calculateForSchool(s, userScore, { difficultyMode })
  );
  results.sort((a: any, b: any) => b.finalScore - a.finalScore);

  if (save && consent) {
    try {
      const now = new Date().toISOString();
      const ip =
        (req.headers['x-forwarded-for'] as string) ||
        req.socket.remoteAddress ||
        '';
      const salt = process.env.IP_SALT || '';
      const ipHash = crypto
        .createHash('sha256')
        .update(ip + salt)
        .digest('hex');
      const record = {
        createdAt: now,
        userScore,
        results,
        ip_hash: ipHash,
        consent: true,
      };
      const SUBMISSIONS_PATH = path.join(
        process.cwd(),
        'data',
        'submissions.json'
      );
      let arr: any[] = [];
      if (fs.existsSync(SUBMISSIONS_PATH)) {
        const raw = fs.readFileSync(SUBMISSIONS_PATH, 'utf-8');
        arr = JSON.parse(raw);
      }
      arr.push(record);
      fs.writeFileSync(SUBMISSIONS_PATH, JSON.stringify(arr, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to persist submission', e);
    }
  }

  res.status(200).json(results);
}

export default withMiddleware(handler);
