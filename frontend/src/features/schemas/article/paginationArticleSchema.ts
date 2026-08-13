import { z } from 'zod';
import { articleSchema } from './articleSchema';

export const paginatedArticlesSchema = z.object({
    data: z.array(articleSchema),
    meta: z.object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
    })
});

export type PaginatedArticlesResponse = z.infer<typeof paginatedArticlesSchema>;