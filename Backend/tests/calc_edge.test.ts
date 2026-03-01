import calc from '../lib/calc';

test('semesterWeightedAvg uses equal weights when semesterWeights empty', () => {
  const user = {
    semesters: [
      { korean: 80, math: 90, english: 70, science: 85, social: 75 },
      { korean: 90, math: 95, english: 85, science: 92, social: 88 },
    ],
  };
  const avg = calc.semesterWeightedAvg(user as any, []);
  // equal weights -> average of the two semesters for math: (90+95)/2 = 92.5
  expect(avg.math).toBeCloseTo((90 + 95) / 2);
});

test('probabilityFromScore uses spread parameter', () => {
  const p1 = calc.probabilityFromScore(90, 85, 2);
  const p2 = calc.probabilityFromScore(90, 85, 10);
  // with smaller spread slope is steeper, so prob should be higher for p1 than p2
  expect(p1).toBeGreaterThan(p2);
});
