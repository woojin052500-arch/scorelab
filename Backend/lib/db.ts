import fs from 'fs';
import path from 'path';

const SCHOOLS_PATH = path.join(process.cwd(), 'data', 'schools.json');

export async function getAllSchools() {
  const raw = fs.readFileSync(SCHOOLS_PATH, 'utf-8');
  return JSON.parse(raw);
}

export async function getSchoolById(id: string) {
  const all = await getAllSchools();
  return all.find((s: any) => s.id === id);
}
