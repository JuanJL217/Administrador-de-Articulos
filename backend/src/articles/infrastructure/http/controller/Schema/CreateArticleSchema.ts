import { z } from 'zod';
import { stringError } from '../../../../../shared/errorSchema';

export type CreateArticleCommand = {
    tittle: string;
    content: string;
    urlImage?: string;
}

export const createArticleBodySchema : z.ZodType<CreateArticleCommand> = z.object({
    tittle: z.string(stringError('titulo'))
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(150, 'El título es demasiado largo'),
    
    content: z.string({
        error: 'El contenido es obligatorio',
    })
    .min(15, 'El contenido debe tener al menos 15 caracteres'),

    urlImage: z.string().url('La imagen debe ser una URL válida').optional()
});