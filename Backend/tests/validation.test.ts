import { CalculateRequestSchema, UserScoreSchema } from '../lib/validation';

test('validation accepts correct userScore', () => {
  const payload = {
    userScore: {
      semesters: [
        { korean: 90, math: 90, english: 90, science: 90, social: 90 },
      ],
    },
  };
  const parsed = CalculateRequestSchema.safeParse(payload);
  expect(parsed.success).toBe(true);
});

test('validation rejects out-of-range scores', () => {
  const payload = {
    userScore: {
      semesters: [
        { korean: -5, math: 200, english: 90, science: 90, social: 90 },
      ],
    },
  };
  const parsed = CalculateRequestSchema.safeParse(payload);
  expect(parsed.success).toBe(false);
});
