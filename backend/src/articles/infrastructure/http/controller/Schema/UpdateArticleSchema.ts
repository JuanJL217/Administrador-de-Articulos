import { z } from 'zod';
import { stringError } from '../../../../../shared/errorSchema';

export type UpdateArticleCommand = {
    title: string;
    content: string;
    urlImage?: string;
}

export const updateArticleBodySchema : z.ZodType<UpdateArticleCommand> = z.object({
    title: z.string(stringError('titulo'))
    .min(2, "El título debe tener al menos 2 caracteres")
    .max(150, "El título es demasiado largo"),

    content: z.string({
        error: "El contenido es obligatorio",
    })
    .min(1, "El contenido debe tener al menos 1 caracter"),

    urlImage: z
    .string()
    .url("La imagen debe ser una URL válida")
    .optional()
    .or(z.literal(""))
});