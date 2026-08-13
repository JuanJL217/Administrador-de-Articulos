import { z } from "zod";
import { authorStatsSchema, type authorStatsData } from "../../features/schemas/user/authorStatsSchema";
import { api } from "../../hooks/axios";

const API_URL_USER = `/users`

const authorStatsArraySchema = z.array(authorStatsSchema);

export async function getAllAuthorsWithStats(): Promise<authorStatsData[]> {
  try {
    const response = await api.get(`${API_URL_USER}/authors-stats`);

    const validatedData = authorStatsArraySchema.parse(response.data);

    return validatedData;

  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'No se pudieron cargar las estadísticas de los autores.';
    throw new Error(errorMessage);
  }
}