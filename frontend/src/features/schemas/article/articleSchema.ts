import { z } from 'zod';

export const articleSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    author: z.string().optional(),
    urlImage: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
    createdAt: z.string().optional(),
});

export type ArticleData = z.infer<typeof articleSchema>;
