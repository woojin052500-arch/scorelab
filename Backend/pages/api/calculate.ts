import type { NextApiRequest, NextApiResponse } from 'next';
import schoolsJson from '../../data/schools.json';
import { calculateForSchool } from '../../lib/calc';
import { CalculateRequestSchema } from '../../lib/validation';
import fs from 'fs';
import path from 'path';
import { withMiddleware } from '../../lib/middleware';
import * as crypto from 'node:crypto'; 
import { getAllSchools } from '../../lib/db';
import * as dotenv from 'dotenv';

dotenv.config();

function apiError(res: NextApiResponse, status: number, message: string) {
  return res.status(status).json({ error: { message } });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return apiError(res, 405, 'Method not allowed');

  const parse = CalculateRequestSchema.safeParse(req.body);
  if (!parse.success) return apiError(res, 400, 'Invalid request payload');

  const { userScore, save, consent, difficultyMode } = parse.data;

  // 1. 기존 기능: DB에서 학교 목록 가져오기 시도
  let schools: any[] = [];
  try {
    const rows = await getAllSchools();
    const dbSchools = rows && rows.length > 0 ? rows : [];
    const jsonSchools = schoolsJson as any[];
    
    // DB와 JSON 데이터를 합쳐서 디미고가 누락되지 않게 함 (ID 기준 중복 제거)
    const schoolMap = new Map();
    [...jsonSchools, ...dbSchools].forEach(s => schoolMap.set(s.id, s));
    schools = Array.from(schoolMap.values());
  } catch (e) {
    schools = schoolsJson as any[];
  }

  // 2. 계산 수행 및 schoolId 매핑 (프론트엔드 연결용)
  const results = schools.map((s: any) => {
    const calculation = calculateForSchool(s, userScore, { difficultyMode });
    return {
      ...calculation,
      schoolId: s.id 
    };
  });

  results.sort((a: any, b: any) => b.finalScore - a.finalScore);

  // 3. 기존 기능: 제출 기록을 submissions.json에 저장
  if (save && consent) {
    try {
      const now = new Date().toISOString();
      const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
      const salt = process.env.IP_SALT || 'default_salt';
      const ipHash = crypto.createHash('sha256').update(ip + salt).digest('hex');
      
      const record = {
        createdAt: now,
        userScore,
        results,
        ip_hash: ipHash,
        consent: true,
      };

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