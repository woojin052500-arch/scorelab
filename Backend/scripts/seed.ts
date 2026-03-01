import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function main() {
  const dbPath = path.join(process.cwd(), 'data', 'schools.db');
  const jsonPath = path.join(process.cwd(), 'data', 'schools.json');
  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const schools = JSON.parse(raw);

  const db = await open({ filename: dbPath, driver: sqlite3.Database });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS schools (
      id TEXT PRIMARY KEY,
      name TEXT,
      type TEXT,
      location TEXT,
      studentCount TEXT,
      history TEXT,
      description TEXT,
      subjectWeights TEXT,
      gradeWeights TEXT,
      cutline REAL,
      difficulty REAL,
      updated_at TEXT
    );
  `);

  const insert = await db.prepare(
    `INSERT OR REPLACE INTO schools (id,name,type,location,studentCount,history,description,subjectWeights,gradeWeights,cutline,difficulty,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
  );
  for (const s of schools) {
    await insert.run(
      s.id,
      s.name,
      s.type,
      s.location,
      s.studentCount || null,
      s.history || null,
      s.description || null,
      JSON.stringify(s.subjectWeights || {}),
      JSON.stringify(s.gradeWeights || {}),
      s.cutline ?? null,
      s.difficulty ?? null,
      new Date().toISOString()
    );
  }
  await insert.finalize();
  await db.close();
  console.log(`Seeded ${schools.length} schools into ${dbPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
