import { z } from 'zod';
import { stringError } from '../../../../../shared/errorSchema';

type ArticuleIdParamSchema = {
    id: string;
};

export const articuleIdParamSchema : z.ZodType<ArticuleIdParamSchema> = z.object({
    id: z.string(stringError('id')).uuid("El id debe ser un UUID válido")
});