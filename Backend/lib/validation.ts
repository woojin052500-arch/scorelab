import { z } from 'zod';

export const SemesterScoreSchema = z.object({
  korean: z.number().min(0).max(100),
  math: z.number().min(0).max(100),
  english: z.number().min(0).max(100),
  science: z.number().min(0).max(100),
  social: z.number().min(0).max(100),
});

export const UserScoreSchema = z.object({
  semesters: z.array(SemesterScoreSchema).min(1).max(12),
});

  userScore: UserScoreSchema,
  save: z.boolean().optional(),
  consent: z.boolean().optional(),
  difficultyMode: z.enum(['add', 'mul']).optional(),
});

export type UserScore = z.infer<typeof UserScoreSchema>;
export type CalculateRequest = z.infer<typeof CalculateRequestSchema>;
