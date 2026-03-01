import type { NextApiRequest, NextApiResponse } from 'next';
import schoolsJson from '../../data/schools.json';
import { calculateForSchool } from '../../lib/calc';
import { CalculateRequestSchema } from '../../lib/validation';
import fs from 'fs';
import path from 'path';
import { withMiddleware } from '../../lib/middleware';
import * as crypto from 'crypto'; 
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

  // 1. 학교 목록 가져오기 (DB 우선, 없으면 JSON)
  let schools: any[] = [];
  try {
    const rows = await getAllSchools();
    // ✅ 수정 포인트: DB 데이터와 JSON 데이터를 합쳐서 중복 제거 (디미고 누락 방지)
    const dbSchools = rows && rows.length > 0 ? rows : [];
    const jsonSchools = schoolsJson as any[];
    
    // ID를 기준으로 합쳐서 DB에 없는 디미고가 포함되도록 함
    const schoolMap = new Map();
    [...jsonSchools, ...dbSchools].forEach(s => schoolMap.set(s.id, s));
    schools = Array.from(schoolMap.values());
  } catch (e) {
    schools = schoolsJson as any[];
  }

  // 2. 모든 학교에 대해 계산 수행
  const results = schools.map((s: any) => {
    const calculation = calculateForSchool(s, userScore, { difficultyMode });
    // ✅ 핵심: 프론트엔드에서 인식할 수 있게 schoolId를 명시적으로 추가
    return {
      ...calculation,
      schoolId: s.id 
    };
  });

  // 3. 점수순 정렬
  results.sort((a: any, b: any) => b.finalScore - a.finalScore);

  // 4. 제출 기록 저장 (원본 로직 그대로 유지)
  if (save && consent) {
    try {
      const now = new Date().toISOString();
      const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
      const salt = process.env.IP_SALT || '';
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

  // 5. 최종 결과 반환
  res.status(200).json(results);
}

export default withMiddleware(handler);