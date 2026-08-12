import {z} from "zod";

type PaginationFilteredQuerySchema = {
    page: number,
    limit: number,
    author?: string
    content?: string,
    title?: string,
}

export const paginationFilteredQuerySchema: z.ZodType<PaginationFilteredQuerySchema> = z.object({
    page: z.coerce.number()
        .int("La página debe ser un número entero")
        .positive("La página debe ser mayor a 0"),
    limit: z.coerce.number()
        .int("El límite debe ser un número entero")
        .positive("El límite debe ser mayor a 0"),
    author: z.string().optional(),
    title: z.string().optional(),
    content: z.string().optional(),
});