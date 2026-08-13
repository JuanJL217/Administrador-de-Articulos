import { z } from 'zod';

export const authorStatsSchema = z.object({
  id: z.string(),
  name: z.string(),
  totalArticles: z.number()
});

export type authorStatsData = z.infer<typeof authorStatsSchema>;