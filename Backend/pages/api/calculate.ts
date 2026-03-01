import type { NextApiRequest, NextApiResponse } from 'next';
import schoolsJson from '../../data/schools.json';
import { calculateForSchool } from '../../lib/calc';
import { CalculateRequestSchema } from '../../lib/validation';
import fs from 'fs';
import path from 'path';
import { withMiddleware } from '../../lib/middleware';
import * as crypto from 'node:crypto'; 

// ✅ 에러의 주범인 getAllSchools를 안전하게 처리
let getAllSchools: any = null;
try {
  const db = require('../../lib/db');
  getAllSchools = db.getAllSchools;
} catch (e) {
  // 모듈이 없어도 빌드가 멈추지 않게 함
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const parse = CalculateRequestSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid request' });

  const { userScore, save, consent, difficultyMode } = parse.data;

  // ✅ 학교 데이터 로드 (JSON 우선)
  let schools: any[] = schoolsJson as any[];
  
  if (getAllSchools) {
    try {
      const dbSchools = await getAllSchools();
      if (dbSchools && dbSchools.length > 0) {
        schools = dbSchools;
      }
    } catch (e) {
      // DB 에러 시 JSON 사용
    }
  }

  // ✅ 디미고가 무조건 포함되도록 schoolId를 부여하며 계산
  const results = schools.map((s: any) => {
    const calculation = calculateForSchool(s, userScore, { difficultyMode });
    return { ...calculation, schoolId: s.id };
  });

  results.sort((a: any, b: any) => b.finalScore - a.finalScore);

  // 저장 로직 (에러 방지형)
  if (save && consent) {
    try {
      const SUBMISSIONS_PATH = path.join(process.cwd(), 'data', 'submissions.json');
      let arr = fs.existsSync(SUBMISSIONS_PATH) ? JSON.parse(fs.readFileSync(SUBMISSIONS_PATH, 'utf-8')) : [];
      arr.push({ createdAt: new Date().toISOString(), userScore, results });
      fs.writeFileSync(SUBMISSIONS_PATH, JSON.stringify(arr, null, 2));
    } catch (e) { }
  }

  res.status(200).json(results);
}

export default withMiddleware(handler);