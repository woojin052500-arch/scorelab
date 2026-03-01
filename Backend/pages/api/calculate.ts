import type { NextApiRequest, NextApiResponse } from 'next';
import schoolsJson from '../../data/schools.json';
import { calculateForSchool } from '../../lib/calc';
import { CalculateRequestSchema } from '../../lib/validation';
import fs from 'fs';
import path from 'path';
import { withMiddleware } from '../../lib/middleware';
import * as crypto from 'node:crypto'; 

// ✅ DB 함수 로드 시도 (없을 경우를 대비)
let getAllSchools: any = null;
try {
  const db = require('../../lib/db');
  getAllSchools = db.getAllSchools;
} catch (e) {
  console.log("DB module not found, using JSON instead.");
}

function apiError(res: NextApiResponse, status: number, message: string) {
  return res.status(status).json({ error: { message } });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return apiError(res, 405, 'Method not allowed');

  const parse = CalculateRequestSchema.safeParse(req.body);
  if (!parse.success) return apiError(res, 400, 'Invalid request payload');

  const { userScore, save, consent, difficultyMode } = parse.data;

  // ✅ 학교 목록 가져오기 로직 (에러 방지형)
  let schools: any[] = [];
  try {
    if (getAllSchools) {
      const rows = await getAllSchools();
      schools = rows && rows.length > 0 ? rows : (schoolsJson as any[]);
    } else {
      schools = schoolsJson as any[];
    }
  } catch (e) {
    schools = schoolsJson as any[];
  }

  // ✅ 결과 생성 및 schoolId 강제 포함 (디미고 노출 핵심)
  const results = schools.map((s: any) => {
    const calculation = calculateForSchool(s, userScore, { difficultyMode });
    return {
      ...calculation,
      schoolId: s.id 
    };
  });

  results.sort((a: any, b: any) => b.finalScore - a.finalScore);

  // 저장 로직 (원본 유지)
  if (save && consent) {
    try {
      const now = new Date().toISOString();
      const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
      const salt = process.env.IP_SALT || 'default_salt';
      const ipHash = crypto.createHash('sha256').update(ip + salt).digest('hex');
      
      const record = { createdAt: now, userScore, results, ip_hash: ipHash, consent: true };
      const SUBMISSIONS_PATH = path.join(process.cwd(), 'data', 'submissions.json');
      
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