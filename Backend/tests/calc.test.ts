import calc from '../lib/calc';
import schools from '../data/schools.json';

test('calculate generates numeric finalScore and probability', () => {
  const user = {
    semesters: [{ korean: 90, math: 95, english: 85, science: 92, social: 88 }],
  };
  const school = (schools as any[])[0];
  const res = calc.calculateForSchool(school, user);
  expect(typeof res.finalScore).toBe('number');
  expect(res.finalScore).toBeGreaterThanOrEqual(0);
  expect(res.finalScore).toBeLessThanOrEqual(100);
  expect(res.probability).toBeGreaterThanOrEqual(0);
  expect(res.probability).toBeLessThanOrEqual(1);
  expect(typeof res.level).toBe('string');
});
