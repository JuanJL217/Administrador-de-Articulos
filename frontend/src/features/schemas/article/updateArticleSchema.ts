import { z } from 'zod';

export const updateArticleSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  content: z.string().min(10, 'El contenido debe tener al menos 10 caracteres'),
  urlImage: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
});

export type UpdateArticleData = z.infer<typeof updateArticleSchema>;
