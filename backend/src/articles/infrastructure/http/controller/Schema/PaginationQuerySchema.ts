import { z } from "zod";

type PaginationQuerySchema = {
    page: number;
    limit: number;
}

export const paginationQuerySchema: z.ZodType<PaginationQuerySchema> = z.object({
    page: z.coerce.number()
        .int("La página debe ser un número entero")
        .positive("La página debe ser mayor a 0"),
    limit: z.coerce.number()
        .int("El límite debe ser un número entero")
        .positive("El límite debe ser mayor a 0")
});